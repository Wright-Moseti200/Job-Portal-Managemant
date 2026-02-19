import React, { useEffect, useState } from 'react'

import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const ViewApplications = () => {
    const [applications, setApplications] = useState([])
    const backendUrl = "https://job-portal-managemant.vercel.app"

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('recruiter-token')
            const response = await fetch(backendUrl + "/api/admin/applications", {
                headers: { 'reccuitertoken': token }
            })
            const data = await response.json()
            if (data.success) {
                setApplications(data.applications)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const changeStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('recruiter-token')
            const response = await fetch(backendUrl + "/api/admin/status", {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'reccuitertoken': token
                },
                body: JSON.stringify({ id, status })
            })
            const data = await response.json()
            if (data.success) {
                toast.success(data.message)
                fetchApplications()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    return (
        <div className='container p-4 max-w-5xl mx-auto'>
            <div className='overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md'>
                <table className='min-w-full bg-white text-left text-sm'>
                    <thead className='bg-gray-50 text-gray-600 font-medium border-b border-gray-200'>
                        <tr>
                            <th className='py-4 px-6 border-b text-left'>#</th>
                            <th className='py-4 px-6 border-b text-left'>User Name</th>
                            <th className='py-4 px-6 border-b text-left'>Job Title</th>
                            <th className='py-4 px-6 border-b text-left'>Location</th>
                            <th className='py-4 px-6 border-b text-left'>Resume</th>
                            <th className='py-4 px-6 border-b text-left'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {applications.map((app, index) => (
                            <tr key={index} className='text-gray-700 hover:bg-gray-50 transition-colors'>
                                <td className='py-4 px-6 border-b text-gray-500'>{index + 1}</td>
                                <td className='py-4 px-6 border-b flex items-center gap-2'>
                                    <img
                                        className='w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm'
                                        src={app.imgSrc || assets.profile_img || "https://via.placeholder.com/30"}
                                        alt=""
                                    />
                                    <span className='font-medium text-gray-800'>{app.applicant_name}</span>
                                </td>
                                <td className='py-4 px-6 border-b'>{app.job_title}</td>
                                <td className='py-4 px-6 border-b text-gray-600'>{app.location}</td>
                                <td className='py-4 px-6 border-b'>
                                    <a href={app.resume} target='_blank' rel="noreferrer" className='bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg inline-flex gap-2 items-center text-xs font-medium hover:bg-indigo-100 transition-colors'>
                                        Resume <img src={assets.resume_download_icon} alt="" className='w-4' />
                                    </a>
                                </td>
                                <td className='py-4 px-6 border-b relative'>
                                    <div className='relative inline-block w-full text-gray-700'>
                                        <select
                                            onChange={(e) => changeStatus(app._id || app.id, e.target.value)}
                                            value={app.status || 'Pending'}
                                            className={`w-full outline-none border rounded px-3 py-1.5 cursor-pointer text-xs font-medium focus:ring-2 focus:ring-offset-1 focus:ring-opacity-50 appearance-none
                                                ${app.status === 'Accepted' ? 'bg-green-100 text-green-700 border-green-200 focus:ring-green-400' :
                                                    app.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200 focus:ring-red-400' :
                                                        'bg-blue-50 text-blue-600 border-blue-200 focus:ring-blue-400'
                                                }
                                            `}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewApplications
