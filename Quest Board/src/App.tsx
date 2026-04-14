import {useEffect, useState} from "react"
import {supabase}from "./lib/supabaseClient"

export default function App() {
const [questsData, setQuestsData] = useState<any[]>([])

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
    <button> Create Policy </button>
    </>
    
  )
}


