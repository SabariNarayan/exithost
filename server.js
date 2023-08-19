const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Connect to your MongoDB Atlas database (replace 'your_connection_url' with your actual connection URL)
mongoose.connect('mongodb+srv://officialsabarinarayan:9447103050@cluster0.buyzcu4.mongodb.net/exit', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Create a mongoose schema for tasks
const taskSchema = new mongoose.Schema({
    task: String,
    status: String, // 'completed' or 'ongoing'
});

const Task = mongoose.model('Task', taskSchema);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, './dist/to-do-app')));

// Create a new task
app.post('/api/tasks', (req, res) => {
    const { task, status } = req.body;

    const newTask = new Task({
        task,
        status,
    });

    newTask.save()
        .then(savedTask => {
            res.status(201).json(savedTask);
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not create task' });
        });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
    Task.find()
        .then(tasks => {
            res.status(200).json(tasks);
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not fetch tasks' });
        });
});

app.delete('/api/tasks/:taskId', async (req, res) => {
    try {
      const { taskId } = req.params;
  
      // Find and remove the task by ID
      const deletedTask = await Task.findByIdAndRemove(taskId);
  
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.status(204).end(); // No content, successful deletion
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not delete task' });
    }
  });

  app.put('/api/tasks/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const updatedTask = req.body;

        // Find and update the task by ID
        const result = await Task.findByIdAndUpdate(taskId, updatedTask, { new: true });

        if (!result) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not update task' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/*', function (req,res) {

    res.sendFil(path.join(__dirname + '/dist/to-do-app/index.html'))
});
