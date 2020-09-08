import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LancamentosTable from './lancamentosTable'
import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localstorageService'

import * as messages from '../../components/toastr'

import { Dialog } from 'primereact/dialog';

class ConsultaLancamentos extends React.Component{

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmeDialog: true,
        lancamentos : []
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {
        if(!this.state.ano){
            messages.mensagemErro('O preenchimento ano e obrigatorio')
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(lancamentoFiltro)
            .then(resposta => {
                this.setState({lancamentos: resposta.data})
            }).catch(error =>{
                console.log(error)
            })
    }

   editar = (id) => {
       console.log('editando o lancamento ' ,id)
   } 

   deletar = ( lancamento ) => {
        this.service.deletar(lancamento.id).then(response => {
            const lancamentos = this.state.lancamentos;
            const index = lancamentos.indexOf(lancamento)
            lancamentos.splice(index,1);
            this.setState(lancamentos)
            messages.mensagemSucesso('Lancamento deletado com sucesso!')
        }).catch(error => {
            messages.mensagemErro('Ocorreu um erro ao tentar deletar o Lancamento')
        })
    } 

    render(){
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        return (
            <Card title="Consulta Lancamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" Label="Ano: *">
                                <input type="text" 
                                       className="form-control" 
                                       id="inputAno"
                                       value={this.state.ano}
                                       onChange={e => this.setState({ano: e.target.value})}
                                       placeholder="Digite o Ano"/>
                            </FormGroup>
                            <FormGroup htmlFor="inputMes" Label="Mes: ">
                                <SelectMenu id="inputMes" 
                                            value={this.state.mes}
                                            onChange={e => this.setState({mes: e.target.value})}
                                            className="form-control" 
                                            lista={meses} />
                            </FormGroup>
                            <FormGroup htmlFor="inputDesc" Label="Descricao: ">
                                <input type="text" 
                                        className="form-control" 
                                        id="inputDesc"
                                        value={this.state.descricao}
                                        onChange={e => this.setState({descricao: e.target.value})}
                                        placeholder="Digite a Descricao"/>
                            </FormGroup>                            
                            <FormGroup htmlFor="inputTipo" Label="Tipo: ">
                                <SelectMenu id="inputTipo" 
                                            value={this.state.tipo}
                                            onChange={e => this.setState({tipo: e.target.value})}                                
                                            className="form-control" 
                                            lista={tipos} />
                            </FormGroup>    

                            <button onClick={this.buscar} type="button" className="btn btn-success">Buscar</button>                        
                            <button type="button" className="btn btn-danger">Cadastrar</button>                        
                        </div>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos} 
                                              deleteAction={this.deletar} 
                                              editAction={this.editar}/>
                        </div>
                    </div>
                </div>
                <div>
                <Dialog header="Header" 
                        visible={this.state.showConfirmeDialog} 
                        style={{ width: '50vw' }} 
                        modal={true}
                        footer={this.renderFooter('displayBasic')} 
                        onHide={() => this.onHide({showConfirmeDialog: false})}>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </Dialog>
 
                </div>
            </Card>
        )
    }

}

export default withRouter(ConsultaLancamentos)