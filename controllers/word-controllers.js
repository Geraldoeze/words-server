const { getDb } = require("../database/mongoConnect");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

exports.getRandom = async (req, res, next) => {
  const db = await getDb();
  try {
    const dataFromDb = await db.collection("alphabet").find({}).toArray();
    return res.status(200).json({ data: dataFromDb });
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve words" });
  }
};

exports.getbyId = async (req, res, next) => {
  const db = await getDb();
  try {
    // Extract the alphabet parameter from the request
    const alphabet = req.params.wid;
    const fetched_data = await db
      .collection("alphabet")
      .findOne({ alphabet: alphabet.toUpperCase() });

    // If data is found, send it as a JSON response

    if (
      typeof fetched_data === "object" &&
      Object.keys(fetched_data).length > 2
    ) {
      res.status(200).json(fetched_data);
    } else {
      res.status(404).json({ message: "Alphabet not found!!" });
    }
  } catch (error) {
    console.error("Error fetching", error);
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
};

exports.getAlphabets = async (req, res, next) => {
  const db = await getDb();
  try {
    // Perform database-related operations
    const dataFromDb = await db.collection("alphabet").find({}).toArray();
    res.status(200).json({ data: dataFromDb });
  } catch (err) {
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
};

exports.postWords = async (req, res, next) => {
  const db = await getDb();

  // Extract the alphabet and word details from req.body
  const { alphabet, word } = req.body;

  try {
    // Find the existing alphabet document (if it exists)
    const existingAlphabet = await db
      .collection("alphabet")
      .findOne({ alphabet: alphabet });

    if (existingAlphabet) {
      // Alphabet exists, check if the word exists in 'words'
      const existingWord = existingAlphabet.words.find(
        (w) => w.name === word.name
      );

      if (!existingWord) {
        // Word does not exist, add the new word to 'words'
        word.isRead = false; // Add the isRead property

        existingAlphabet.words.push(word);

        // Update the existing alphabet document in the collection
        await db
          .collection("alphabet")
          .updateOne(
            { alphabet: alphabet },
            { $set: { words: existingAlphabet.words } }
          );

        // Respond with success message
        return res.status(200).json({
          message: "Word added successfully.",
        });
      } else {
        // Word already exists, handle as needed (e.g., update or ignore)
        console.log("Word already exists:");
        return res.status(404).json({
          error: "Error",
          message: "This word already exists in the database",
        });
      }
    } else {
      // Alphabet doesn't exist, create a new alphabet document
      const newAlphabet = {
        alphabet: alphabet,
        words: [word], // Create an array with the new word
      };

      // Insert the new alphabet document into the collection
      await db.collection("alphabet").insertOne(newAlphabet);

      // Respond with success message
      return res.status(200).json({
        message: "Alphabet and word added successfully.",
      });
    }
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({
      error: "An error occurred while saving data.",
      message: error.message,
    });
  }
};

// exports.postWordss = async (req, res, next) => {
//   const db = await getDb();
//   // Extract the alphabet and words from req.body
//   const { alphabet, words } = req.body;

//   try {
//     const existingAlphabet = await db
//       .collection("alphabets")
//       .findOne({ alphabet: alphabet.toUpperCase() });

//     if (existingAlphabet) {
//       // Alphabet exists, check if the word exists in 'words'
//       if (!existingAlphabet.words[words.name]) {
//         // Word does not exist, add the new word to 'words'
//         existingAlphabet.words[words.name] = words.meaning;

//         // Update the existing alphabet document in the collection
//         await db
//           .collection("alphabets")
//           .updateOne(
//             { alphabet: alphabet.toUpperCase() },
//             { $set: { words: existingAlphabet.words } }
//           );

//         // Respond with success message
//         return res.status(200).json({
//           message: "Word added successfully.",
//         });
//       } else {
//         // Word already exists, handle as needed (e.g., update or ignore)
//         console.log("Word already exists:");
//         return res.status(404).json({
//           error: "Error",
//           message: "This word already exists in the database",
//         });
//       }
//     } else {
//       // Alphabet doesn't exist, create a new alphabet document
//       const newAlphabet = {
//         alphabet: alphabet,
//         words: { [words.name]: words.meaning },
//       };

//       // Insert the new alphabet document into the collection
//       await db.collection("alphabets").insertOne(newAlphabet);

//       // Respond with success message
//       return res.status(200).json({
//         message: "Alphabet and word added successfully.",
//       });
//     }
//   } catch (error) {
//     console.error("Error saving data:", error);
//     res.status(500).json({
//       error: "An error occurred while saving data.",
//       message: error.message,
//     });
//   }
// };

// async function transformData(sourceCollection, transformationFunction) {
//   const cursor = sourceCollection.find();
//   const transformedData = [];

//   while (await cursor.hasNext()) {
//     const document = await cursor.next();
//     const transformedDocument = transformationFunction(document);
//     transformedData.push(transformedDocument);
//   }

//   return transformedData;
// }

// exports.changeStructure = async (req, res) => {
//   const db = await getDb();

//   try {
//     const sourceCollection = db.collection("alphabets");
//     const transformationFunction = (document) => {
//       const transformedData = {
//         alphabet: document.alphabet,
//         words: Object.entries(document.words).map(([name, meaning]) => ({
//           name,
//           meaning,
//           description: "",
//           isRead: false, // You can set the initial value for isRead here
//         })),
//       };

//       return transformedData;
//     };

//     const transformedData = await transformData(
//       sourceCollection,
//       transformationFunction
//     );

//     // Respond with the transformed data
//     res.json(transformedData);

//     // Save the transformed data in a new collection
//     const targetCollection = db.collection("alphabet");
//     await targetCollection.insertMany(transformedData);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };
