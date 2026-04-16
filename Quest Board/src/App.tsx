import {useEffect, useState} from "react"
import {supabase}from "./lib/supabaseClient"
import { type Session } from '@supabase/supabase-js'

type QuestStatus = "completed" | "in_progress" | "not_started"
type Difficulty = "low" | "medium" | 'high'
type Quest = {id: string, title:string, user_id: string, description: string | null, status: QuestStatus | null, difficulty: Difficulty | null}

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
  fetchQuests()
  
},[])

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
    await getSession()
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

const mappedData = questsData.map(quest => {
  return <div key={quest.id} className="quest">
  <h2>{quest.title}</h2>
  <p>{quest.description}</p>
  <p>{quest.status}</p>
  <p>{quest.difficulty}</p>
  </div>
})

  return (
    <>
    <div className="questContainer"> 
    {mappedData}
    </div>
    <form className="customQuestForm" onSubmit={handleSubmit}>
<div className="formSection">  
    <label htmlFor="questTitle">Quest title</label>  
    <input type="text" onChange={(e)=> setTitle(e.target.value)} value={title} name="questTitle" placeholder="Slay a dragon..." id="questTitle" required/>
</div>
<div className="formSection">
    <label htmlFor="questDescription">Quest description</label>
    <textarea name="questDescription" id="questDescription" value={description} onChange={(e)=> setDescription(e.target.value)} placeholder="I am looking for strong warriors to.."></textarea>
</div>
<div className="formSection">
    <label htmlFor="questStatus">Quest status</label>
    <select id="questStatus" name="questStatus" value={status} onChange={(e)=> {
      const val = e.target.value
      if (val === "completed" || val === "in_progress"|| val === "not_started"){
        setStatus(val)
      }
    }}> 
      <option value="completed">Completed</option>
      <option value="in_progress">In progress</option>
      <option value="not_started">Not started</option>
    </select>
</div>
<div className="formSection">
    <label htmlFor="questDifficulty">Quest difficulty</label>
    <select id="questDifficulty" name="questDifficulty" value={difficulty} onChange={(e)=> {
      const val = e.target.value
      if (val === "low" || val === "medium"|| val === "high"){
        setDifficulty(val)
      }
    }}> 
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
</div>
    <button type="submit">Create Quest</button>
    </form>
<p>
  {loading ? "Checking session..." : session ? session.user.id : "No session"}
</p>

<form onSubmit={handleLoginSubmit}>
<div>
<label htmlFor="email">Email</label>
  <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
</div>
<div>
<label htmlFor="password">Password</label>
  <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
</div>

  <button type="submit">Login</button>  
</form>
 </>
    
  )
}


