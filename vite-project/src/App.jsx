import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from "@/components/ui/button"
import './App.css'
import { Route, Routes } from 'react-router-dom'
import WeatherPage from './page/WeatherPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Routes>
        <Route path='/' element = {<WeatherPage/>}/>
      </Routes>
    </div>
  )
}

export default App
