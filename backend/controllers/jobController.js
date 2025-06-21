export const getAllJobs = (req, res) => {
  res.json([
    { id: 1, title: 'Frontend Developer', company: 'Google' },
    { id: 2, title: 'Backend Engineer', company: 'Amazon' }
  ])
}

export const getJobById = (req, res) => {
  const jobId = req.params.id
  res.json({ id: jobId, title: 'Job Title', company: 'Company Name' })
}
