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

  return (
    <>
    <h1> Hello </h1>
    <pre>{JSON.stringify(questsData, null, 2)}</pre>
    </>
    
  )
}


