import { Col, Layout, Row, Tabs, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../services/todoService";
import TodoForm from "./TodoForm";
import TodoTab from "./TodoTab";

const { TabPane } = Tabs;
const { Content } = Layout;

const TodoList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [todos, setTodos] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState();

  const handleFormSubmit = (todo) => {
    console.log("Todo to create", todo);
    createTodo(todo).then(onRefresh());
    message.success("Todo created!");
  };

  const handleRemoveTodo = (todo) => {
    deleteTodo(todo.id).then(onRefresh());
    message.warning("Todo deleted!");
  };

  const handleToggleTodoStatus = (todo) => {
    todo.completed = !todo.completed;
    updateTodo(todo).then(onRefresh());
    message.info("Todo status updated!");
  };

  const refresh = () => {
    getTodos()
      .then((json) => {
        setTodos(json);
        setActiveTodos(json.filter((todo) => todo.completed === 0));
        setCompletedTodos(json.filter((todo) => todo.completed === 1));
      })
      .then(console.log("Fetch Completed."));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    let data = await getTodos();
    setTodos(data);
    setActiveTodos(data.filter((todo) => todo.completed === 0));
    setCompletedTodos(data.filter((todo) => todo.completed === 1));
    setRefreshing(false);
    console.log("Refresh state", refreshing);
  }, [refreshing]);

  useEffect(() => {
    refresh();
  }, [onRefresh]);

  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px" }}>
        <div className="todolist">
          <Row>
            <Col span={20} offset={0}>
              <h1>My Todos</h1>
              <TodoForm onFormSubmit={handleFormSubmit}></TodoForm>
              <br />
              <Tabs defaultActiveKey="all">
                <TabPane tab="All" key="all">
                  <TodoTab
                    todos={todos}
                    onTodoToggle={handleToggleTodoStatus}
                    onTodoRemoval={handleRemoveTodo}
                  ></TodoTab>
                </TabPane>
                <TabPane tab="Active" key="active">
                  <TodoTab
                    todos={activeTodos}
                    onTodoToggle={handleToggleTodoStatus}
                    onTodoRemoval={handleRemoveTodo}
                  ></TodoTab>
                </TabPane>
                <TabPane tab="Complete" key="complete">
                  <TodoTab
                    todos={completedTodos}
                    onTodoToggle={handleToggleTodoStatus}
                    onTodoRemoval={handleRemoveTodo}
                  ></TodoTab>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default TodoList;
