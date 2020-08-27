import React, { useState, useEffect } from 'react';
import { Container, Owner, Loading, BackButton, IssuesList, PageActions,PageActionsStatus } from './styles';
import api from '../../services/api';
import { FaArrowLeft } from 'react-icons/fa'

export default function Repositorio({ match }) {

    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);

    const [status, setStatus] = useState('open');


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
    }, []);

    useEffect(()=>{
        async function loadIssue(){
            console.log('oi')
            const nomeRepo = decodeURIComponent(match.params.repositorio);
            const response = await api.get(`/repos/${nomeRepo}/issues`,{
                params:{
                    state: status,
                    page: page,
                    per_page: 5
                }
            });

            setIssues(response.data);
        }
        loadIssue();
    },[match.params.repositorio,page,status]);

    function handlePage(action) {
        setPage(action === 'back' ? page - 1 : page + 1)
    }



    function handleStatus(status){
        setStatus(status);
    }

    if (loading) {
        return (
            <Loading>
                Carregando
            </Loading>
        )
    }
    return (
        <Container>
            <BackButton to="/">
                <FaArrowLeft color="#000" size={30} />
            </BackButton>
            <Owner>
                <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} />

                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </Owner>


            <PageActionsStatus>
                <button type="button" onClick={() => {handleStatus('all')}}  disabled={status === 'all'}>
                    All
                </button>

                <button type="button" onClick={() => {handleStatus('open')}} disabled={status === 'open'} >
                    Abertas
                </button>

                <button type="button" onClick={() => {handleStatus('closed')}} disabled={status === 'closed'} >
                    Fechadas
                </button>
            </PageActionsStatus>

            <IssuesList>
                {issues.map((issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />
                        <div>
                            <strong>
                                <a href={issue.html_url} target="_blank">{issue.title}</a><br /><br />
                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                )))}
            </IssuesList>

            <PageActions>
                <button type="button" onClick={() => {handlePage('back')}} disabled={page < 2}>
                    Voltar
                </button>
                <button type="button" onClick={() => {handlePage('next')}}>Próxima</button>

            </PageActions>
        </Container>
    )
}