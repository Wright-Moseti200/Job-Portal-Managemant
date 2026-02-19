import React, { useState } from 'react'
import { toast } from 'react-toastify'


const AddJob = () => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("Programming")
    const [location, setLocation] = useState("Bangalore")
    const [level, setLevel] = useState("Beginner Level")
    const [salary, setSalary] = useState("")

    const backendUrl = "https://job-portal-managemant.vercel.app"

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('recruiter-token')
            const response = await fetch(backendUrl + '/api/admin/job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'reccuitertoken': token
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    location,
                    level,
                    salary
                })
            })
            const data = await response.json()
            if (data.success) {
                toast.success("Job added successfully")
                setTitle("")
                setDescription("")
                setLocation("")
                setSalary("")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 text-gray-700 bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 max-w-4xl'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Post a new Job</h2>

            <div className='w-full'>
                <p className='mb-2 font-medium'>Job Title</p>
                <input className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition' type="text" placeholder='Type here' value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className='w-full'>
                <p className='mb-2 font-medium'>Job Description</p>
                <textarea className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition' rows={6} placeholder='Write content here' value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full justify-between'>
                <div className='w-full sm:w-1/3'>
                    <p className='mb-2 font-medium'>Job Category</p>
                    <select className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-gray-600 bg-white' onChange={(e) => setCategory(e.target.value)} value={category}>
                        <option value="Programming">Programming</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Designing">Designing</option>
                        <option value="Networking">Networking</option>
                        <option value="Management">Management</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                </div>

                <div className='w-full sm:w-1/3'>
                    <p className='mb-2 font-medium'>Job Location</p>
                    <select className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-gray-600 bg-white' onChange={(e) => setLocation(e.target.value)} value={location}>
                        <option value="Bangalore">Bangalore</option>
                        <option value="San Francisco">San Francisco</option>
                        <option value="New York">New York</option>
                        <option value="London">London</option>
                        <option value="Dubai">Dubai</option>
                        <option value="Washington">Washington</option>
                    </select>
                </div>

                <div className='w-full sm:w-1/3'>
                    <p className='mb-2 font-medium'>Job Level</p>
                    <select className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-gray-600 bg-white' onChange={(e) => setLevel(e.target.value)} value={level}>
                        <option value="Beginner Level">Beginner Level</option>
                        <option value="Intermediate Level">Intermediate Level</option>
                        <option value="Senior Level">Senior Level</option>
                    </select>
                </div>
            </div>

            <div className='w-full'>
                <p className='mb-2 font-medium'>Job Salary</p>
                <input className='w-full lg:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition' type="number" placeholder='2500' value={salary} onChange={(e) => setSalary(e.target.value)} required />
            </div>

            <button className='w-full sm:w-auto px-8 py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm' type='submit'>Post Job</button>
        </form>
    )
}

export default AddJob
