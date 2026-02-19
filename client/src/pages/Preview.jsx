import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Preview = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [resumeUrl, setResumeUrl] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const backendUrl = "https://job-portal-managemant.vercel.app"

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) return

      const response = await fetch(backendUrl + '/api/users/resume', {
        headers: { 'auth-token': token }
      })
      const data = await response.json()
      if (data.success && data.resume) {
        setResumeUrl(data.resume)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) return

      const response = await fetch(backendUrl + '/api/users/applications', {
        headers: { 'auth-token': token }
      })
      const data = await response.json()
      if (data.success) {
        // The controller returns 'appliactions' (typo in backend)
        setApplications(data.appliactions || [])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      toast.error("Please login to view this page")
      navigate('/')
      return
    }
    fetchResume()
    fetchApplications()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === "application/pdf") {
      setResumeFile(file)
    } else {
      toast.error("Please select a PDF file")
    }
  }

  const uploadResume = async () => {
    if (!resumeFile) return

    const formData = new FormData()
    formData.append('resume', resumeFile)

    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(backendUrl + '/api/users/resume', {
        method: 'POST',
        headers: { 'auth-token': token }, // Content-Type is auto-set for FormData
        body: formData
      })
      const data = await response.json()
      if (data.success) {
        toast.success("Resume uploaded successfully")
        setResumeUrl(data.resume || URL.createObjectURL(resumeFile)) // Optimistic or refetch
        fetchResume()
        setIsEdit(false)
        setResumeFile(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to upload resume")
    }
  }

  return (
    <div className='container px-4 2xl:px-20 mx-auto py-10'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Resume</h2>

      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-10'>
        {resumeUrl && !isEdit ? (
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200'>
              <img src={assets.resume_selected} alt="pdf" className='w-8' />
              <div>
                <p className='text-sm font-medium'>My Resume</p>
                <a href={resumeUrl} target='_blank' rel="noreferrer" className='text-xs text-blue-500 hover:underline'>View PDF</a>
              </div>
            </div>
            <button
              onClick={() => setIsEdit(true)}
              className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Edit
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-4 max-w-sm'>
            <p className='text-gray-600 text-sm'>Upload your resume (PDF only) to apply for jobs.</p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className='block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100'
            />
            <div className='flex gap-2'>
              <button
                onClick={uploadResume}
                disabled={!resumeFile}
                className={`px-6 py-2 rounded-full text-white font-medium transition-colors ${resumeFile ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                {resumeUrl ? "Update Resume" : "Upload Resume"}
              </button>
              {isEdit && <button onClick={() => setIsEdit(false)} className='text-gray-500 hover:text-gray-700'>Cancel</button>}
            </div>
          </div>
        )}
      </div>

      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Applied Jobs</h2>
      <div className='overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100'>
        <table className='min-w-full text-left text-sm whitespace-nowrap'>
          <thead className='bg-gray-50 text-gray-600 font-medium border-b border-gray-200'>
            <tr>
              <th className='px-6 py-4'>Company</th>
              <th className='px-6 py-4'>Job Title</th>
              <th className='px-6 py-4'>Location</th>
              <th className='px-6 py-4'>Date</th>
              <th className='px-6 py-4'>Status</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {applications.length > 0 ? applications.map((job, index) => (
              <tr key={index} className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4 flex items-center gap-3'>
                  <img src={assets.company_icon} alt="" className='w-8 h-8 rounded shadow-sm' />
                  {/* Company ID is used as fallback for name since name isn't in model */}
                  {job.company_id}
                </td>
                <td className='px-6 py-4 text-gray-800 font-medium'>{job.job_title}</td>
                <td className='px-6 py-4 text-gray-600'>{job.location}</td>
                <td className='px-6 py-4 text-gray-600'>{new Date(job.date).toDateString()}</td>
                <td className='px-6 py-4'>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                        ${job.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                      job.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'}`}>
                    {job.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className='px-6 py-8 text-center text-gray-500'>No applications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Preview