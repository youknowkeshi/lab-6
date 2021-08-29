import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Result = () => {
    let query = useQuery()
    let dtstart = query.get("start")
    let dtend = query.get("end")
    const [arr, setArray] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const fetchApi = async () => {
        try {
            const resp =
            await axios.get(`https://api.coindesk.com/v1/bpi/historical/close.json?currency=THB&start=${dtstart}&end=${dtend}`)
            let newArr = []
                for (const [key, value] of Object.entries(resp.data.bpi)) {
                    newArr.push(`${key} - ${Number(value).toLocaleString()} THB`)                    
                }
                setArray(newArr)
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
            setError(true)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchApi()
    }, [])

    const render = () => {
        if (loading)
            return (
                <div className='text-center space-y-3'>
                    <p className='text-2xl font-semibold'>Historical price</p>
                    <p className='text-2xl'>Loading ...</p>
                </div>
            )
        else if(error)
            return(
                <div className='text-center space-y-3'>
                    <p className='text-2xl font-semibold'>Historical price</p>
                    <p className='text-2xl' style={{color: 'red'}}>There was an error. Please try again later.</p>
                </div>
            )
        else
            return (
                <div className='text-center space-y-3'>
                    <p className='text-2xl font-semibold'>Historical price</p>
                    <p className='text-2xl font-semibold'>(From {dtstart} To {dtend})</p>
                    <p className='text-2xl'>{arr.map(x => <p>{x}</p>)}</p>
                </div>
            )
    }
    return (
        <div>
            {render()}
        </div>
    )
    // return (
    //     <div className='text-center space-y-3'>
    //         <p className='text-2xl font-semibold'>Historical price</p>
    //         <p className='text-2xl'>Loading ...</p>
    //         <p className='text-2xl text-red-500'>There was an error. Please try again later.</p>
    //         <p className='text-xl font-semibold'> ( From 2021-01-01 To 2021-01-02)</p>
    //         <ul>
    //             <li className='text-xl'>2021-01-01 - {(1000000).toLocaleString()} THB</li>
    //             <li className='text-xl'>2021-01-02 - {(2000000).toLocaleString()} THB</li>
    //             <li className='text-xl'>2021-01-03 - {(3000000).toLocaleString()} THB</li>
    //         </ul>
    //     </div>
    // )
}

export default Result