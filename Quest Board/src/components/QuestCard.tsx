import { type QuestCardProps } from "./../types"

export default function QuestCard({ id,title, description, status, difficulty, onDelete }: QuestCardProps) {
  return (
    <div className="quest-card">
      <h2>{title}</h2>
      <p>{description ?? "No description provided"}</p>
      <p>Status: {status}</p>
      <p>Difficulty: {difficulty}</p>
      <button onClick={()=>{onDelete(id)}}>Delete</button>
    </div>
  );
}