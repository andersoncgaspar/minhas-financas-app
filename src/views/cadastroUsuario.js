import React from 'react'

import Card from '../components/card'
import FormGroup from '../components/form-group'
import {withRouter} from 'react-router-dom'
import UsuarioService from '../app/service/usuarioService'
import {mensagemSucesso, mensagemErro} from '../components/toastr'

class CadastroUsuario extends React.Component{

    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    constructor(){
        super();
        this.service = new UsuarioService();
    }

    validar(){
        const msgs = []

        if(!this.state.nome){
            msgs.push('O Campo Nome e obrigatorio.')
        }

        if(!this.state.email){
            msgs.push('O campo Email e obrigatorio.')
        }else if(!this.state.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)){
            msgs.push('Informe um Email valido.')
        }

        if(!this.state.senha || !this.state.senhaRepeticao){
            msgs.push('Digite a senha 2x.')
        }else if(this.state.senha !== this.state.senhaRepeticao){
            msgs.push('As senhas nao batem!')
        }

        return msgs;
    }

    cadastrar = () => {
        const msgs = this.validar();

        if(msgs && msgs.length > 0){
            msgs.forEach( (msg, index) => {
                mensagemErro(msg)
            });
            return false;
        }

        const usuario = {
            nome: this.state.nome,
            email: this.state.email,
            senha: this.state.senha
        }

        this.service.salvar(usuario)
            .then(response => {
                mensagemSucesso('Usurio cadastrado com sucesso! Efetue o login!')
                this.props.history.push('/login')
            }).catch(error => {
                mensagemErro(error.response.data)
            })
    }

    cancelar = () => {
        this.props.history.push('/login')
    }

    render(){
        return (
            <Card title="Cadastro de Usuario">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="bs-component">
                            <FormGroup Label="Nome: *" htmlFor="inputNome">
                                <input type="text"
                                        id="inputNome"
                                        className="form-control"
                                        name="nome"
                                        onChange={e => this.setState({nome: e.target.value})} />
                            </FormGroup>
                            <FormGroup Label="Email: *">
                                <input type="email"
                                        id="inputEmail"
                                        className="form-control"
                                        nome="email"
                                        onChange={e => this.setState({email: e.target.value})} />
                            </FormGroup>
                            <FormGroup Label="Senha: *">
                                <input type="password"
                                        id="inputSenha"
                                        className="form-control"
                                        nome="senha"
                                        onChange={e => this.setState({senha: e.target.value})} />
                            </FormGroup> 
                            <FormGroup Label="Repita a Senha: *">
                                <input type="password"
                                        id="inputRepitaSeha"
                                        className="form-control"
                                        nome="senha"
                                        onChange={e => this.setState({senhaRepeticao: e.target.value})} />
                            </FormGroup>     
                            <button onClick={this.cadastrar} type="button" className="btn btn-success">Salvar</button>                                                          
                            <button onClick={this.cancelar} type="button" className="btn btn-danger">Cancelar</button>                                                          
                        </div>
                    </div>
                </div>    
            </Card>
        )
    }
}

export default withRouter(CadastroUsuario)