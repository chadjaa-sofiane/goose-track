import React, { useState } from 'react'
import Button from '@/components/button'
import RadioSelector from '@/components/radioSelector'
import InputField from '@/components/inputField'
import ExitIcon from '@/assets/exit.svg?react'
import Callender from './components/callender'
import ProfileImageUploader from './components/profileImageUploader'

const OPTIONS = ['Month', 'Day']

const App = () => {
    const [selected, setSelected] = useState(OPTIONS[0])
    const [email, setEmail] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const onChange = (selected: string) => {
        console.log(selected)
        setSelected(selected)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const file = e?.target?.files[0]
        setImage(file)
        console.log(image)
    }

    return (
        <div className="container font-Inter m-auto text-text flex flex-col gap-y-4 items-start">
            <Button icons={{ end: <ExitIcon /> }}> Log out</Button>
            <RadioSelector
                options={OPTIONS}
                selected={selected}
                onChange={onChange}
            />
            <InputField
                name="email"
                value={email}
                label="email"
                type="password"
                onChange={handleChange}
                placeHolder="enter your name here"
                message="this should be longer"
                status="done"
            />
            <Callender />
            <ProfileImageUploader onChange={handleFileChange} />
        </div>
    )
}

export default App
