import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useGetAllTodos } from "./api/todo/todo-api.service";
import { Amplify } from "aws-amplify";
import awsConfig from "./aws-exports.js";
import { withAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(awsConfig);

function App() {
  const [todo, setTodo] = useState<string>("");
  const [submissions, setSubmission] = useState<string[]>([]);
  const { data, isLoading } = useGetAllTodos();

  const handleChangeTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(event.target.value);
  };
  const handleSubmitTodo = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (todo.length <= 0) {
      return;
    }
    setSubmission([...submissions, todo]);
    setTodo("");
  };
  const handleDeleteClick = (idx: number) => {
    // remove todo
    let currSubmission = [...submissions];
    currSubmission.splice(idx, 1);
    setSubmission(currSubmission);
  };

  return (
    <div className="App">
      <h3>Todo App</h3>
      <div className="card">
        <input onChange={handleChangeTodo} value={todo} />
      </div>
      <button onClick={handleSubmitTodo}>Submit</button>

      {submissions.map((sub, idx) => {
        return (
          <div
            className="card"
            key={idx + "sub"}
            style={{
              backgroundColor: "#b6bab9",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              borderRadius: "10px",
              margin: "5px",
            }}
          >
            {sub}
            <button
              onClick={(e) => {
                handleDeleteClick(idx);
              }}
              style={{
                backgroundColor: "#b6bab9",
              }}
            >
              X
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default withAuthenticator(App);
