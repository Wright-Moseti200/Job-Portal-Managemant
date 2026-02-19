import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const Jobs = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = "https://job-portal-managemant.vercel.app"

  const fetchJob = async () => {
    try {
      const response = await fetch(backendUrl + '/api/users/jobs')
      const data = await response.json()
      if (data.success) {
        // Note: The ID in URL might be string, ID from backend might be number or string. 
        // Using loose comparison or ensuring types match. 
        // Assuming backend uses `id` (number) or `_id` (string). 
        // Admin uploaded jobs have `id` (custom increment) but Mongo has `_id`. 
        // Let's check both or console log if issues arise. 
        // The id from params is likely the mongo _id if passed from Homepage links using ._id
        const foundJob = data.jobsdata.find((j) => j._id === id || j.id == id);
        setJob(foundJob);
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to load job details")
    } finally {
      setLoading(false)
    }
  }

  const applyForJob = async () => {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      toast.error("Please login to apply")
      return
    }
    if (!job) return

    try {
      const response = await fetch(backendUrl + '/api/users/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          title: job.title,
          location: job.location,
          company_id: job.companyId.name, // Using name as fallback if companyId is object
          job_id: job._id || job.id
        })
      })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen flex-col gap-4">
        <p className="text-gray-500 text-lg">Job not found...</p>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-[5%]">

        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6">
          <img src={assets.left_arrow_icon || ''} alt="Back" className="w-4 h-4" />
          Back to Jobs
        </Link>

        {/* Main Content Wrapper - Removed card styling (shadow, border, rounded-xl) */}
        <div>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white rounded-lg mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <img
                    src={job.companyId?.image || assets.company_icon}
                    alt={job.companyId?.name || "Company"}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
                  <div className="flex items-center gap-2 mt-1 opacity-90">
                    <span className="font-medium">{job.companyId?.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">{job.level}</span>
                  </div>
                </div>
              </div>

              <button onClick={applyForJob} className="bg-white text-blue-600 px-8 py-3 rounded font-bold hover:bg-blue-50 transition-colors shadow-lg">
                Apply Now
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Description */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Job Description</h2>
              <div
                className="prose prose-blue max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: job.description }}
              ></div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Job Overview</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <img src={assets.location_icon} alt="" className="w-5 h-5 mt-0.5 opacity-60" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-800">{job.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <img src={assets.money_icon} alt="" className="w-5 h-5 mt-0.5 opacity-60" />
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-medium text-gray-800">${job.salary}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <img src={assets.suitcase_icon} alt="" className="w-5 h-5 mt-0.5 opacity-60" />
                    <div>
                      <p className="text-sm text-gray-500">Job Type</p>
                      <p className="font-medium text-gray-800">{job.level}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <img src={assets.person_icon} alt="" className="w-5 h-5 mt-0.5 opacity-60" />
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-800">{job.category}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-blue-800 mb-2">Interested?</h3>
                <p className="text-gray-600 text-sm mb-4">Don't miss out on this opportunity.</p>
                <button onClick={applyForJob} className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;