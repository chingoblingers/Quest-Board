
import { type SubmitQuestFormProps } from "./../types"
export default function SubmitQuestForm({title, setTitle, description, setDescription, status, setStatus, difficulty, setDifficulty, handleSubmit}: SubmitQuestFormProps){
    return(
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
    )
}