const jobModel = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await jobModel
    .find({ createdBy: req.user.userId })
    .sort("createdAt");
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await jobModel.findOne({ createdBy: userId, _id: jobId });
  if (!job) throw new NotFoundError("no job found with this id");
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  const { company, position } = req.body;
  const job = await jobModel.create({
    company,
    position,
    createdBy: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await jobModel.findOneAndRemove({
    createdBy: userId,
    _id: jobId,
  });
  if (!job) throw new NotFoundError("no job found with this id");
  res.status(StatusCodes.OK).send();
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;
  if (!company || !position)
    throw new BadRequestError("Company and Position cannot be empty");

  const job = await jobModel.findOneAndUpdate(
    { createdBy: userId, _id: jobId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) throw new NotFoundError("no job found with this id");
  res.status(StatusCodes.OK).json({ job });
};

module.exports = { getAllJobs, getJob, createJob, deleteJob, updateJob };
