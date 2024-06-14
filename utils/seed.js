const connection = require('../config/connection');
const { Thought, User } = require('../models');
const { getRandomName, getRandomAssignments } = require('./data');
//what does this do?
connection.on('error', (err) => err);//sets up an error event listener on the database connection, so if it occurs, it'll be logged.

connection.once('open', async () => {//one-time event listener for when the database connection is opened, then following codes inside the { callback function } will be executed
  console.log('connected');
    // Delete the collections if they exist
    let courseCheck = await connection.db.listCollections({ name: 'courses' }).toArray();//checks if the collections 'courses' and 'students' exist in the database
    if (courseCheck.length) {//length are not 0
      await connection.dropCollection('courses');//it drops (deletes) the collections
    }//efore seeding the database with new data, any existing 'courses' and 'students' collections are deleted to start with a clean slate.

    let studentsCheck = await connection.db.listCollections({ name: 'students' }).toArray();
    if (studentsCheck.length) {
      await connection.dropCollection('students');
    }


  // Create empty array to hold the students
  const students = [];//to hold student data

  // Loop 20 times -- add students to the students array (add student objects to the students array)
  for (let i = 0; i < 20; i++) {
    // Get some random assignment objects using a helper function that we imported from ./data
    const assignments = getRandomAssignments(20);// generates random assignment objects for each student

    const fullName = getRandomName();
    const first = fullName.split(' ')[0];//why binary array?
    const last = fullName.split(' ')[1];//generates a random full name
    const github = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;
//generates a GitHub username by combining the first name with a random number between 18 and 99
    students.push({//constructs a student object array with these properties
      first,
      last,
      github,
      assignments,
    });
  }

  // Add students to the collection and await the results
  const studentData = await User.create(students);
  //create student documents in the database based on the data stored in the students array
  // Add courses to the collection and await the results
  await Thought.create({//creates a course document in the 'courses' collection
    courseName: 'UCLA',//course name
    inPerson: false,//Boolean not in Person
    students: [...studentData.map(({_id}) => _id)],
  });//student IDs are extracted from the studentData array

  // Log out the seed data to indicate what should appear in the database
  console.table(students);//logs the seed data
  console.info('Seeding complete! 🌱');//logs a message
  process.exit(0);//exits the process to ensure that the script terminates after seeding the database
});
