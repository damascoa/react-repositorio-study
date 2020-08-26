import React, { useState, useCallback, useEffect } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Container, Form, SubmitButton, List, DeleteButton } from './styles'


import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function Main() {
    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState('0');
    //DidMount
    //BUSCAR DADOS
    useEffect(() => {
        const repoStorage = localStorage.getItem('repos');
        if (repoStorage) {
            setRepositorios(JSON.parse(repoStorage));
        }
    }, []);


    //DidUpdate SALVAR ALTERACAO
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios));
    }, [repositorios]);


    function handleinputChange(e) {
        setNewRepo(e.target.value);
    }

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        async function submit() {
            setLoading(true);
            setAlert('0');
            try {
                if (newRepo === '') {
                    throw new Error('Informe um valor!');
                }

                const response = await api.get(`repos/${newRepo}`);

                const hasRepo = repositorios.find(repo => repo.name === newRepo);
                if (hasRepo) {
                    throw new Error('Repositório já existe!')
                }
                const data = {
                    name: response.data.full_name,
                }
                setRepositorios([...repositorios, data]);
                setNewRepo('');
            } catch (error) {
                setAlert('1');
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        submit();
    }, [newRepo, repositorios]);


    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo);
        setRepositorios(find);
    }, [repositorios]);

    return (
        <Container>
            <h1> <FaGithub /> Meus Repositorios {alert} 2</h1>
            <Form onSubmit={handleSubmit}>
                <input type="text"
                    placeholder={alert}
                    value={newRepo} onChange={handleinputChange}
                />
                <SubmitButton loading={loading ? 1 : 0}>
                    {
                        loading ?
                            (<FaSpinner color="#fff" size={14} />)
                            :
                            (<FaPlus color="#fff" size={14} />)
                    }

                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    )
}

