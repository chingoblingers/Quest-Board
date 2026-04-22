import { type QuestCardProps } from "./../App"

export default function QuestCard({ title, description, status, difficulty }: QuestCardProps) {
  return (
    <div className="quest-card">
      <h2>{title}</h2>
      <p>{description ?? "No description provided"}</p>
      <p>Status: {status}</p>
      <p>Difficulty: {difficulty}</p>
    </div>
  );
}