import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button} from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import axios from 'axios'
const WeatherPage = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [weather, setWeather] = useState(null)
    const inputRef = useRef(null);
    
    // useEffect(() => {

    //     console.log("weather in usEffect ", weather);
    //     console.log("error in usEffect ", error);
        
    // }, [weather, error])
    const fetchWeather = async() => {
        const api_key = import.meta.env.VITE_API_KEY
        const city = inputRef.current.value.toLowerCase().trim()

        if(!/^[A-Za-z\s]+$/.test(city)){
            setWeather(null)
            setError("Please enter valid city name")
            return
        }

        try {
            setLoading(true);
            setError(null);
            setWeather(null);
            const coordinateRes = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${api_key}`)
        
            if(coordinateRes.data.length === 0 ){
                setError("city not found")
                console.log("city not found")
                return
            }
            console.log("coordinateRes is ",coordinateRes);
            const coordinateData = coordinateRes.data
            const cityCoordinates = coordinateData.find((obj) => obj.name.toLowerCase() === city) || coordinateData[0]
            console.log("cityCoordinates is ",cityCoordinates);
            const {lon, lat} = cityCoordinates;
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
            setWeather(res.data)
            console.log("weather  ", weather)
        } catch (error) {
            console.log("error while fetching weather is ",error);
            setError("error while fetching weather is")
        }
        finally{
            setLoading(false)
        }

    }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 p-6'>
        <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">Weather Checker</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className='flex gap-2'>
                    <Input placeholder="Enter city name" ref={inputRef} className="flex-1"/>
                    <Button onClick = {fetchWeather} disabled={loading} className = "w-[150px]">
                        {loading ?
                            <div className='w-full flex justify-center'>
                                <Loader2 className='animate-spin w-4 h-4'/>Loading...
                            </div>: "Check Weather"}
                    </Button>
                </div>
                {weather ? (
                    <div className='text-center'>
                        <h2 className='text-xl font-semibold'>{weather.name}</h2>
                        <p className='text-sm text-muted-foreground'>
                            {weather.weather[0].description}
                        </p>
                        <p className='text-4xl font-bold'>{Math.round(weather.main.temp)}℃</p>
                        <div className='mt-2 flex justify-center gap-6 text-sm text-muted-foreground'>
                                <span>Humidity: {weather.main.humidity}%</span>
                                <span>Wind: {weather.wind.speed} m/s</span>
                        </div>
                    </div>
                ) : (
                    error && <p className='text-center text-sm text-destructive'>{error}</p>
                )}
            </CardContent>
        </Card>
    </div> 
  )
}

export default WeatherPage