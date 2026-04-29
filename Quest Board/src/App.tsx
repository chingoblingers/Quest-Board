import {useEffect, useState} from "react"
import {supabase}from "./lib/supabaseClient"
import { type Session } from '@supabase/supabase-js'
import QuestCard from "./components/QuestCard"
import LoginForm from "./components/LoginForm"
import SubmitQuestForm from "./components/SubmitQuestForm"

type QuestStatus = "completed" | "in_progress" | "not_started"
type Difficulty = "low" | "medium" | 'high'
type Quest = {id: string, title:string, user_id: string, description: string | null, status: QuestStatus | null, difficulty: Difficulty | null}
export type QuestCardProps = Pick<Quest, "id" | "title" | "description" | "status" | "difficulty"> & { onDelete: (id: string) => void}
export type LoginFormProps = {
  email: string, 
  password: string, setEmail: (value: string) => void, 
  setPassword: (value: string)=> void, 
  handleLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>}
export type SubmitQuestFormProps = {
  title:string, 
  setTitle: (value:string)=> void, 
  description:string, 
  setDescription: (value: string)=> void, 
  status: QuestStatus, 
  setStatus: (value: QuestStatus)=> void, 
  difficulty:Difficulty, 
  setDifficulty: (value:Difficulty)=> void, 
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>}  

export default function App() {
const [questsData, setQuestsData] = useState<Quest[]>([])
const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const [status, setStatus] = useState<QuestStatus>("not_started")
const [difficulty, setDifficulty] = useState<Difficulty>('low')
const [loading, setLoading] = useState(true)
const [session, setSession] = useState<Session | null>(null)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

useEffect(()=>{
  getSession()

  const subscribe = supabase.auth.onAuthStateChange((event, session) => {
    setSession(session)
  })

  return () => {
    subscribe.data.subscription.unsubscribe()
  }
  
},[])

useEffect(()=>{

    if (!session){
      setQuestsData([])
      return
    }

  fetchQuests()
},[session])

async function getSession(){
  try{
    const {data, error} = await supabase.auth.getSession()
    if (error){
      throw error
    }
    setSession(data.session)
  }catch(error){
    console.error(`unable to get session due to error ${error}`)
    
  }finally{
    setLoading(false)
  }

}




async function fetchQuests(){
  try{
  const {data, error} = await supabase.from('quests').select('*')
  if (error){
    throw error
  }
    setQuestsData(data)
    
  }catch(error){
    console.error(`unable to fetch quests due to Error: ${error}`)
  }
   
}

async function addQuest(){

  const userId = session?.user?.id

  if (!userId){
    throw new Error('No user session found. Please log in to create a quest.')
  }

    const {error} = await supabase.from("quests").insert([{
    title: title,
    description: description,
    status: status,
    difficulty: difficulty,
    user_id: userId
  }])
  
  if(error){
    throw error
  }

  await fetchQuests()

}

async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>){
  e.preventDefault()
  try{
    const {error} = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error){
      throw error
    }
  }catch(error){
    console.error(`Login failed due to error ${error}`)
  }finally{
    setPassword('')
  }
}

async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
  e.preventDefault()
  try{
    await addQuest()
    setTitle('')
    setDescription('')
    setStatus("not_started")
    setDifficulty('low')
  } catch (error) {
    console.error(`Could not create quest due to error ${error}`)
  }

}

async function handleDelete(id: string) {
  console.log("deleting quest" , id)
  try {
    const { error } = await supabase
      .from("quests")
      .delete()
      .eq("id", id)

    if (error) {
      throw error
    }

    await fetchQuests()
  } catch (error) {
    console.error(`unable to delete due to following error: ${error}`)
  }
}

async function handleSignOut(){
  try {
   const {error} = await supabase.auth.signOut()
   
   if (error){
    throw error
   }
  } catch (error) {
    console.error(`failed to sign out due to ${error}`)
  }
}

const mappedData = questsData.map(quest => <QuestCard key={quest.id} {...quest} onDelete={handleDelete}/>)

  return (
    <>
    {loading?
    <p>Checking for Session...</p>
    : session ? <div>
      <div className="questContainer"> 
      {mappedData}
      </div>
      <SubmitQuestForm title={title} 
      setTitle={setTitle} 
      description={description} 
      setDescription={setDescription} 
      status={status} 
      setStatus={setStatus} 
      difficulty={difficulty} 
      setDifficulty={setDifficulty}
      handleSubmit={handleSubmit}
      />
      <button onClick={handleSignOut}>Logout</button>
    </div>
    : <LoginForm email={email} password={password} setPassword={setPassword} setEmail={setEmail} handleLoginSubmit={handleLoginSubmit}/>
    }

<p>
  {loading ? "Checking session..." : session ? session.user.id : "No session"}
</p>
 </>
    
  )
}


