export type QuestStatus = "completed" | "in_progress" | "not_started"
export type Difficulty = "low" | "medium" | 'high'
export type Quest = {id: string, title:string, user_id: string, description: string | null, status: QuestStatus | null, difficulty: Difficulty | null}
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