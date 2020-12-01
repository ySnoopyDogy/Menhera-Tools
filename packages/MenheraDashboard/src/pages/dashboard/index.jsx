import React, { useState, useEffect } from 'react';
import {
  Container,
  Buttons,
  Manager,
  Form,
  Input,
  Select,
  Table,
  TBody,
  THead,
  Tr,
} from './styles';
import { getActivities, addActivity, resetActivities, clearActivities } from '../../apis/api';
import { MdAdd, MdRefresh } from 'react-icons/md';
import { HiOutlineTrash } from 'react-icons/hi';
import Button from '../../components/Button';

const options = ['PLAYING', 'WATCHING', 'STREAMING', 'LISTENING'];
const emojis = ['🎮', '📺', '📹', '🎧'];

export default () => {
  const [activities, setActivities] = useState([]);
  const [activityType, setActivityType] = useState('PLAYING');
  const [activityName, setActivityName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await getActivities();
      setActivities(response?.data.sort() ?? []);
    };

    fetchData();
  }, []);

  function onChangeSelect(event) {
    console.log(event.target.value);
    setActivityType(event.target.value);
  }

  function onChangeInput(event) {
    setActivityName(event.target.value);
  }

  async function addNewActivity(event) {
    event.preventDefault();
    if (!activityName) {
      return;
    }
    await addActivity(activityName, activityType);
    setActivities(activities.concat({ name: activityName, type: activityType }));
    setActivityName('');
  }

  async function onClickCleanButton() {
    await clearActivities();
    setActivities([]);
  }

  async function onClickResetButton() {
    // try {
    const reset = await resetActivities();
    setActivities(reset);
    // } catch (error) {
    //   console.log('Whoops! Houve um erro.', error.message || error);
    // }
  }

  return (
    <Container>
      <Manager />
      <Form>
        <Input value={activityName} onChange={onChangeInput} />
        <Select onChange={onChangeSelect}>
          {options.map((o, i) => (
            <option key={o} value={o}>
              {emojis[i]}
            </option>
          ))}
        </Select>
        <Button onClick={addNewActivity}>
          <MdAdd />
          Adicionar
        </Button>
      </Form>
      <Buttons>
        <Button onClick={onClickResetButton}>
          <MdRefresh />
          Resetar
        </Button>
        <Button onClick={onClickCleanButton}>
          <HiOutlineTrash />
          Apagar tudo
        </Button>
      </Buttons>
      <Manager />
      <Table>
        <THead>
          <Tr>
            <th>Name</th>
            <th>Type</th>
          </Tr>
        </THead>
        <TBody>
          {activities?.map(activity => (
            <Tr key={activity.name}>
              <td>{activity.name}</td>
              <td>{activity.type}</td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </Container>
  );
};