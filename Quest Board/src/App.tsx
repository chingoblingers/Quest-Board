import {useEffect, useState} from "react"
import {supabase}from "./lib/supabaseClient"

type QuestStatus = "completed" | "in_progress" | "not_started"
type Difficulty = "low" | "medium" | 'high'
type Quest = {id: string, title:string, user_id: string, description: string | null, status: QuestStatus | null, difficulty: Difficulty | null}

export default function App() {
const [questsData, setQuestsData] = useState<Quest[]>([])
const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const [status, setStatus] = useState<QuestStatus>("not_started")
const [difficulty, setDifficulty] = useState<Difficulty>('low')

useEffect(()=>{
  fetchQuests()
},[])

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

    const {error} = await supabase.from("quests").insert([{
    title: title,
    description: description,
    status: status,
    difficulty: difficulty,
    user_id: "ed9e0f12-a41e-4fc6-9d10-e1c97c2d0f75"
  }])
  
  if(error){
    throw error
  }

  await fetchQuests()

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
    </>
    
  )
}


