import multer from "multer";

const storage = multer.memoryStorage(); // Store in buffer
const upload = multer({ storage });

export default upload;
