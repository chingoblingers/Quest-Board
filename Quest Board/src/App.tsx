import {useEffect, useState} from "react"
import {supabase}from "./lib/supabaseClient"

type QuestStatus = "completed" | "in_progress" | "not_started" 
type Quest = {id: string, title:string, user_id: string, description: string | null, status: QuestStatus | null, difficultly:string | null}

export default function App() {
const [questsData, setQuestsData] = useState<Quest[]>([])

useEffect(()=>{
  fetchQuests()
},[])

async function fetchQuests(){
  try{
  const {data, error} = await supabase.from('quests').select('*')
  if (error){
    throw error
  }else{
    setQuestsData(data)
    console.log(data)
  }
  }catch(error){
    console.error(`unable to fetch quests due to Error: ${error}`)
  }
   
}

async function addQuest(){
  try{

    const {error} = await supabase.from("quests").insert([{
    title: "Insert Quest Test",
    description: "testing inserting a quest to the table",
    status: "not started",
    difficultly: "low",
    user_id: "ed9e0f12-a41e-4fc6-9d10-e1c97c2d0f75"
  }])
  
  if(error){
    throw error
  }

  fetchQuests()

  }catch (error){
    console.error(`Could not create quest due to error ${error}`)
  }

}

const mappedData = questsData.map(quest => {
  return <div key={quest.id}>
  <h2>{quest.title}</h2>
  <p>{quest.description}</p>
  <p>{quest.status}</p>
  <p>{quest.difficultly}</p>
  </div>
})

  return (
    <>
    <h1> Hello </h1>
    {mappedData}
    <button onClick={addQuest}> Add Quest </button>
    </>
    
  )
}


