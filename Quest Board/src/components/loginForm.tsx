import { type LoginFormProps } from "../types"
export default function LoginForm({email, password, setEmail, setPassword, handleLoginSubmit}: LoginFormProps){
    return(
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
    )
}