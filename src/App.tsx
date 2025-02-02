import { ChangeEvent, useState } from "react";
import { PlusCircle } from "phosphor-react";
import { Header } from "./components/Header";
import { Task } from "./components/Task";
import { NotFound } from "./components/NotFound";

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import styles from "./App.module.css";

interface IFormInput {
  id: number;
  title: string;
  completed: boolean;
}

const listOfTasks = [
  {
    id: 1,
    title: "Stury for exam",
    completed: false,
  },
  {
    id: 2,
    title: "Do exercises",
    completed: false,
  },
  {
    id: 3,
    title: "Code",
    completed: false,
  },
];

const schema = yup.object({
  title: yup.string().required().min(1).max(100),
});

function App() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTask] = useState(listOfTasks);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const allTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed === true).length;

  const handleNewTask: SubmitHandler<IFormInput> = (data) => {
    const newTaskInList = {
      id: tasks.length + 1,
      title: data.title,
      completed: false,
    };
    setTask((task) => [newTaskInList, ...task]);
    reset();
  };

  function deleteTask(id: number) {
    const deletingTask = tasks.filter((c) => c.id !== id);
    setTask(deletingTask);
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <form onSubmit={handleSubmit(handleNewTask)} className={styles.toDo}>
          <input
            type="text"
            placeholder="Adicione uma nova tarefa"
            {...register("title")}
          />
          <button type="submit">
            Criar
            <PlusCircle size={20} />
          </button>
        </form>
        <div className={styles.errors}>
          {errors?.title?.type === "required" && <span>Insira uma tarefa.</span>}
          {errors?.title?.type === "max" && <span>O título deve ter no máximo 100 caracteres.</span>}
        </div>
        <div className={styles.stateOfTheTask}>
          <button className={styles.tasksCreated}>
            Tarefas criadas
            <span>{allTasks}</span>
          </button>
          <button className={styles.completedTasks}>
            Concluídas
            <span>
              {completedTasks} de {allTasks}
            </span>
          </button>
        </div>
        {tasks.length === 0 ? (
          <NotFound />
        ) : (
          tasks.map((task) => {
            return (
              <Task
                key={task.id}
                list={task}
                data={tasks}
                setState={setTask}
                onDeleteTask={deleteTask}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;
