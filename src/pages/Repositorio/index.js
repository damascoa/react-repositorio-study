import React, { useState, useEffect } from 'react';
import { Container } from './styles';
import api from '../../services/api';
import { matchPath } from 'react-router-dom';

export default function Repositorio({ match }) {

    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function load() {
            const nomeRepo = decodeURIComponent(match.params.repositorio);

            /*const response = await api.get(`/repos/${nomeRepo}`);
            const inssues = await api.get(`/repos/${nomeRepo}/inssues`); */
            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: 'open',
                        per_page: '5'
                    }
                })
            ]);
            setRepositorio(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);
        
        }
        load();
    }, [])

    return (

        <Container>

        </Container>
    )
}