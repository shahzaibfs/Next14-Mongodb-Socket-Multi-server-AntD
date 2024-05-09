import mongoose, { Schema, type Document } from "mongoose";

interface IServer extends Document {
  name: string;
  url: string;
  password: string;
}

const ServerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Server = mongoose.model<IServer>("Server", ServerSchema);

export default Server;
