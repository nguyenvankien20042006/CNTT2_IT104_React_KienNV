import axios from "axios"
import React from "react"
import { useForm } from "react-hook-form"

interface FormData {
    image: FileList
    description: string
}
export default function Ex01() {
    const {register, handleSubmit, reset} = useForm<FormData>()
    const [data, setData] = React.useState<{url: string, description: string} | null>(null)

    const onSubmit = async(data: FormData) => {
        try {
            const formData = new FormData()
            formData.append('file', data.image[0])
            formData.append('upload_preset', 're_upload')
            formData.append('description', data.description)

            const response = await axios.post('https://api.cloudinary.com/v1_1/dxkw3nupk/image/upload', formData)
            setData({url: response.data.secure_url, description: data.description})
            reset()
        } catch (error) {
            console.error(error)
        }
    }

    return <div className="max-w-lg mx-auto mt-10">
        <form action="" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <input className="border border-gray-500 rounded" type="file" {...register("image", {})}/>
            <input className="border border-gray-500 rounded" type="text" placeholder="Description" {...register("description", {})}/>
            <button className="border border-gray-500 rounded" type="submit">Upload</button>
        </form>

        {data && <div className="mt-4">
            <img src={data.url} alt={data.description} width={200}/>
            <p>{data.description}</p>
        </div>}
    </div>
}