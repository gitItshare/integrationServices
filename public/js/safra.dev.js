const buttonCli = document.getElementById("addRepCli")
const buttonRemoveCli = document.getElementById("removeCli")
const buttonCliTerceiros = document.getElementById("addRepCli-terceiros")
const buttonRemoveCliTerceiros = document.getElementById("removeCli-terceiros")
const clientGrupos = document.getElementById("clientGrupos")
const terceirosList = document.getElementById("nome-representante-terceiros-list")
const terceirosEmailList = document.getElementById("email-representante-terceiros-list")
const terceirosCpfList = document.getElementById("cpf-representante-terceiros-list")

const clientEmailList = document.getElementById("email-representante-list")
const clientCpfList = document.getElementById("cpf-representante-list")

const buttonAvalista = document.getElementById("addRepCli-avalista")
const buttonRemoveAvalista = document.getElementById("removeCli-avalista")
const x2js = new X2JS();
const data = {
	Params: {
		"TemplateFieldData": {
			"CodForm": "1",
			"Linhas_Tabela1": "2",
			"Linhas_Tabela1_unformatted": "2",
			"Linhas_Tabela2": "1",
			"Linhas_Tabela2_unformatted": "1",
			"Num_Contrato": "2",
			"Num_Contrato_unformatted": "2",
			"Valor": "51.436,00",
			"Valor_unformatted": "51436.00",
			"Operacao_Com_Lastro": {
				"_key": "NÃO",
				"__text": "NÃO"
			},
			"Possui_Dom_Manual": {
				"_key": "SIM",
				"__text": "SIM"
			},
			"Emitente": {
				"Emitente_Razao_Social": "yuji itadori",
				"Emitente_CNPJ": "02974733000152",
				"Emitente_Endereco": "avenida shibuya",
				"Emitente_Cidade": "shibuya",
				"Emitente_Bairro": "central",
				"Emitente_Estado": {
					"_key": "SP",
					"__text": "SP"
				},
				"Emitente_CEP": "13060-729",
				"Emitente_Conta_Corrente": "11111",
				"Emitente_Conta_Corrente_unformatted": "11111",
				"Emitente_Agencia": "22222",
				"Emitente_Agencia_unformatted": "22222",
				"_displayName": "Emitente",
				"_displayValue": "Emitente"
			},
			"Avalistas": {
				"Tabela_Avalistas_Container": {
					"Tabela_Avalistas": [{
							"Avalistas_Nome_Razao_Social": "teste 1",
							"Avalistas_CPF_CNPJ": "02974733000153",
							"Avalistas_Endereco": "Rua Júlio Girardi",
							"Avalistas_Cidade": "Campinas",
							"Avalistas_Bairro": "vila",
							"Avalistas_Estado": {
								"_key": "SP",
								"__text": "SP"
							},
							"Avalistas_CEP": "13060-729",
							"_displayName": "",
							"_displayValue": ""
						},
						{
							"Avalistas_Nome_Razao_Social": "teste 2",
							"Avalistas_CPF_CNPJ": "02974733000154",
							"Avalistas_Endereco": "teste end",
							"Avalistas_Cidade": "sao paulo",
							"Avalistas_Bairro": "pq industrial",
							"Avalistas_Estado": {
								"_key": "SP",
								"__text": "SP"
							},
							"Avalistas_CEP": "13060-728",
							"_displayName": "",
							"_displayValue": ""
						}
					],
					"_displayName": "Tabela Avalistas",
					"_displayValue": "Tabela Avalistas"
				},
				"_displayName": "Avalistas",
				"_displayValue": "Avalistas"
			},
			"Terceiro_Garantidor": {
				"Tabela_Terceiro_Garantidor_Container": {
					"Tabela_Terceiro_Garantidor": {
						"Terceiro_Garantidor_Nome_Razao_Social": "teste terceiro",
						"CPF_CNPJ": "02974733000155",
						"Terceiro_Garantidor_Endereco": "Rua Júlio Girardi",
						"Terceiro_Garantidor_Cidade": "Campinas",
						"Terceiro_Garantidor_Bairro": "itapetao",
						"Terceiro_Garantidor_Estado": {
							"_key": "SP",
							"__text": "SP"
						},
						"Terceiro_Garantidor_CEP": "13060-722",
						"_displayName": "",
						"_displayValue": ""
					},
					"_displayName": "Tabela Terceiro Garantidor",
					"_displayValue": "Tabela Terceiro Garantidor"
				},
				"_displayName": "Terceiro Garantidor",
				"_displayValue": "Terceiro Garantidor"
			},
			"Caracteristicas_da_Operacao": {
				"Valor_do_Emprestimo": "11.111,00",
				"Valor_do_Emprestimo_unformatted": "11111.00",
				"Encargo_Fiat": "10",
				"Encargo_Fiat_unformatted": "10",
				"Taxa_de_Juros__pagamento_por_debito_em_conta_Safra": "2",
				"Taxa_de_Juros__pagamento_por_debito_em_conta_Safra_unformatted": "2",
				"Taxa_de_juros__pagamentos_por_outros_meios": "1",
				"Taxa_de_juros__pagamentos_por_outros_meios_unformatted": "1",
				"Taxa_de_juros_efetiva_ao_mes__pagamento_por_debito_em_conta_Safra": "4",
				"Taxa_de_juros_efetiva_ao_mes__pagamento_por_debito_em_conta_Safra_unformatted": "4",
				"Taxa_de_juros_efetiva_ao_ano__pagamento_por_debito_em_conta_Safra": "40",
				"Taxa_de_juros_efetiva_ao_ano__pagamento_por_debito_em_conta_Safra_unformatted": "40",
				"Taxa_de_juros_efetiva_ao_mes__pagamento_por_outros_meios": "15",
				"Taxa_de_juros_efetiva_ao_mes__pagamento_por_outros_meios_unformatted": "15",
				"Taxa_de_juros_efetiva_ao_ano__pagamento_por_outros_meios": "20",
				"Taxa_de_juros_efetiva_ao_ano__pagamento_por_outros_meios_unformatted": "20",
				"Vencimento_final": "07/12/2023",
				"Vencimento_final_unformatted": "2023-12-07T00:00:00.0000000",
				"Encargos": {
					"_key": "Pré-fixados",
					"__text": "Pré-fixados"
				},
				"Taxa_CDI__pagamento_por_debito_em_conta_Safra": "1%",
				"Taxa_CDI__pagamento_por_debito_em_conta_Safra_unformatted": "1",
				"Taxa_CDI__pagamento_por_outros_meios": "2",
				"Taxa_CDI__pagamento_por_outros_meios_unformatted": "2",
				"Incidencia": {
					"_key": "Saldo devedor em aberto",
					"__text": "Saldo devedor em aberto"
				},
				"Periodicidade_da_capitalizacao_dos_encargos": "2",
				"Praca_de_pagamento": "3",
				"Os_debitos_totais_ou_parciais_das_parcelas_e_ou__do_saldo_devedor_do_debito_ora_assumido_na_conta_iniciada_no_item__12__abaixo": "True",
				"Utilizacao_de_limite_de_credito_existente_na_referida_conta_pra_realizacao_dos_debitos_total_ou_parcialmente": "True",
				"Realizacao_dos_debitos_decorrentes_de_obrigacao_vencida_inclusive_por_meio_de_pagamentos_parciais": "True",
				"Tabela_Parcelas_Container": {
					"Tabela_Parcelas": {
						"Vencimento": "22/12/2023",
						"Vencimento_unformatted": "2023-12-22T00:00:00.0000000",
						"Valor_da_parcela": "1.231,00",
						"Valor_da_parcela_unformatted": "1231.00",
						"_displayName": "",
						"_displayValue": ""
					},
					"_displayName": "Valor do principal quando se tratar de encargos flutuantes ou o valor do principal mais juros quando se tratar de operacao pre fixada",
					"_displayValue": "Valor do principal quando se tratar de encargos flutuantes ou o valor do principal mais juros quando se tratar de operacao pre fixada"
				},
				"Local_de_liberacao_de_recursos__Codigo_do_banco": "11111",
				"Local_de_liberacao_de_recursos__Codigo_do_banco_unformatted": "11111",
				"_displayName": "Características da Operação",
				"_displayValue": "Características da Operação"
			},
			"Demais_Encargos_e_Despesas": {
				"IOF_Aliquota_De_Percentual_ao_dia": "1",
				"IOF_Aliquota_De_Percentual_ao_dia_unformatted": "1",
				"IOF_Aliquota_De_Valor_RS": "10,00",
				"IOF_Aliquota_De_Valor_RS_unformatted": "10.00",
				"IOF_Aliquota_De_Percentual_calculado_sobre_o_valor_do_credito": "1",
				"IOF_Aliquota_De_Percentual_calculado_sobre_o_valor_do_credito_unformatted": "1",
				"IOF_Aliquota_De_Percentual_Calculado_Sobre_o_Valor_do_Credito_Valor_RS": "20,00",
				"IOF_Aliquota_De_Percentual_Calculado_Sobre_o_Valor_do_Credito_Valor_RS_unformatted": "20.00",
				"Outros": "nada",
				"Tarifas_de_emissao_de_contratos": "1,00",
				"Tarifas_de_emissao_de_contratos_unformatted": "1.00",
				"Outras_tarifas_de_emissao_de_contrato": "2",
				"Valor_de_Outras_tarifas_de_emissao_de_contrato": "3,00",
				"Valor_de_Outras_tarifas_de_emissao_de_contrato_unformatted": "3.00",
				"_displayName": "Demais Encargos e Despesas",
				"_displayValue": "Demais Encargos e Despesas"
			},
			"Tarifas_Vigentes": {
				"Encargos_e_despesas_financiados__IOF_e_Tarifa_de_Abertura_de_Credito_e_Seguro_Prestamista__este_quando_contratado": {
					"_key": "NÃO",
					"__text": "NÃO"
				},
				"_displayName": "Tarifas Vigentes",
				"_displayValue": "Tarifas Vigentes"
			},
			"Garantias": {
				"Garantias_Dropdown": {
					"_key": "Hipoteca",
					"__text": "Hipoteca"
				},
				"Juros_de_mora_Taxa_CDI_Acrescida_De": "10",
				"Juros_de_mora_Percentual_ao_Dia": "1",
				"Juros_de_mora_Percentual_ao_Dia_unformatted": "1",
				"Data_limite_de_reembolso": "22/12/2023",
				"Data_limite_de_reembolso_unformatted": "2023-12-22T00:00:00.0000000",
				"_displayName": "Garantias",
				"_displayValue": "Garantias"
			},
			"Emissao_e_outros_dados_dessa_cedula": {
				"Numero_de_vias__por_extenso": "dois",
				"Local_da_emissao": "local da emissao",
				"Data_da_emissao": "2019-12-13",
				"Data_da_emissao_unformatted": "2019-12-13T00:00:00.0000000",
				"_displayName": "Emissão e outros dados dessa cédula",
				"_displayValue": "Emissão e outros dados dessa cédula"
			},
			"Protocolo_em_todas_as_paginas": {
				"PROTOCOLO__Rodape": "teste rodape",
				"_displayName": "Protocolo em todas as páginas",
				"_displayValue": "Protocolo em todas as páginas"
			},
			"Local": "banco do braza",
			"Data": "29/12/2023",
			"Data_unformatted": "2023-12-29T00:00:00.0000000",
			"Caracteristicas_da_operacao_garantida": {
				"operacao_garantida": {
					"_key": "Cédula de Crédito",
					"__text": "Cédula de Crédito"
				},
				"Caracteristicas_Da_Operacao_Garantida_Numero": "12",
				"Caracteristicas_Da_Operacao_Garantida_Numero_unformatted": "12",
				"_displayName": "Características da operação garantida",
				"_displayValue": "Características da operação garantida"
			},
			"Forma_de_Pagamento": {
				"Forma_De_Pagamentos_Num_de_Prestacoes": "50",
				"Forma_De_Pagamentos_Num_de_Prestacoes_unformatted": "50",
				"Periodicidade": "mensal",
				"Dos_encargos": "*Dos encargos",
				"_displayName": "Forma de Pagamento",
				"_displayValue": "Forma de Pagamento"
			},
			"Cedente_Fiduciante_Section": {
				"Cedente_Fiduciante": {
					"_key": "Devedor",
					"__text": "Devedor"
				},
				"_displayName": "Cedente Fiduciante",
				"_displayValue": "Cedente Fiduciante"
			},
			"Devedor": {
				"Devedor_Razao_Social": "devedor morre cedo",
				"Devedor_Endereco_Sede": "Rua Júlio Girardi",
				"Devedor_CNPJ": "78.920.328/0001-13",
				"_displayName": "Devedor",
				"_displayValue": "Devedor"
			},
			"Objeto_de_Cessao_Fiduciaria_em_Garantia": {
				"VISA": "True",
				"MASTERCARD": "True",
				"ELO": "",
				"HIPERCARD": "",
				"AMEX": "",
				"_displayName": "Objeto de Cessão Fiduciária em Garantia",
				"_displayValue": "Objeto de Cessão Fiduciária em Garantia"
			},
			"Conta_Vinculada": {
				"Conta_Vinculada_Agencia": "12232",
				"Conta_Vinculada_Agencia_unformatted": "12232",
				"Conta_Vinculada_Numero": "45",
				"Conta_Vinculada_Numero_unformatted": "45",
				"_displayName": "Conta Vinculada",
				"_displayValue": "Conta Vinculada"
			},
			"Valor_da_Garantia": {
				"Valor_Da_Garantia_Valor_Percentual": "50%",
				"Valor_Da_Garantia_Valor_Percentual_unformatted": "50",
				"Valor_Da_Garantia_Valor_percentual_por_extenso": "cinquenta",
				"_displayName": "Valor da Garantia",
				"_displayValue": "Valor da Garantia"
			},
			"Valor_Minimo_de_Recebiveis_Constituidos": {
				"Valor_Minimo_De_Recebiveis_Constituidos_Valor_percentual": "10%",
				"Valor_Minimo_De_Recebiveis_Constituidos_Valor_percentual_unformatted": "10",
				"Valor_Minimo_De_Recebiveis_Constituidos_Valor_percentual_por_extenso": "dez",
				"_displayName": "Valor Mínimo de Recebíveis Constituídos",
				"_displayValue": "Valor Mínimo de Recebíveis Constituídos"
			},
			"Pag_Assinaturas_Section": {
				"Pagina_de_Assinaturas_Cedente__n": "Cedente",
				"Pagina_de_Assinaturas_Cedente_Conjuge__n": "Cedente Cônjuge",
				"_displayName": "Página de Assinaturas",
				"_displayValue": "Página de Assinaturas"
			},
			"Planilha_CET_Num_do_Contrato": "23",
			"Planilha_CET_Num_do_Contrato_unformatted": "23",
			"Planilha_CET_Data_Simulacao": "19/04/2024",
			"Planilha_CET_Data_Simulacao_unformatted": "2024-04-19T00:00:00.0000000",
			"Planilha_CET_Produto": "Produto",
			"Planilha_CET_CET__a_a": "20%",
			"Planilha_CET_CET__a_a_unformatted": "20",
			"Planilha_CET_Numero_Simulacao": "1",
			"Planilha_CET_Numero_Simulacao_unformatted": "1",
			"Planilha_CET_Prazo__em_dias": "10",
			"Planilha_CET_Prazo__em_dias_unformatted": "10",
			"Discriminacao_dos_Valores": {
				"Discriminacao_dos_Valores_Valor_Solicitado_RS": "10.000,00",
				"Discriminacao_dos_Valores_Valor_Solicitado_RS_unformatted": "10000.00",
				"Discriminacao_dos_Valores_Valor_Solicitado_Percentual": "50%",
				"Discriminacao_dos_Valores_Valor_Solicitado_Percentual_unformatted": "50",
				"Discriminacao_dos_Valores_Valor_Financiado_RS": "5.000,00",
				"Discriminacao_dos_Valores_Valor_Financiado_RS_unformatted": "5000.00",
				"Discriminacao_dos_Valores_Valor_Financiado_Percentual": "25%",
				"Discriminacao_dos_Valores_Valor_Financiado_Percentual_unformatted": "25",
				"Capital_Maximo_Segurado": "100.000,00",
				"Capital_Maximo_Segurado_unformatted": "100000.00",
				"Premio_Liquido_Value": "10.000,00",
				"Premio_Liquido_Value_unformatted": "10000.00",
				"IOF_38": "0,38",
				"IOF_38_unformatted": "0.38",
				"Premio_Total": "110.000,00",
				"Premio_Total_unformatted": "110000.00",
				"Discriminacao_dos_Valores_Valor_da_1_parcela": "10.000,00",
				"Discriminacao_dos_Valores_Valor_da_1_parcela_unformatted": "10000.00",
				"Discriminacao_dos_Valores_Valor_total_das_parcelas_RS": "10.000,00",
				"Discriminacao_dos_Valores_Valor_total_das_parcelas_RS_unformatted": "10000.00",
				"Discriminacao_dos_Valores_Valor_total_das_parcelas_Percentual": "10%",
				"Discriminacao_dos_Valores_Valor_total_das_parcelas_Percentual_unformatted": "10",
				"Discriminacao_dos_Valores_Valor_total_devido_emprestimo_ou_financiamento_ou_arrendamento_mercantil_financeiro_no_ato_da_contratacao_RS": "111,00",
				"Discriminacao_dos_Valores_Valor_total_devido_emprestimo_ou_financiamento_ou_arrendamento_mercantil_financeiro_no_ato_da_contratacao_RS_unformatted": "111.00",
				"Discriminacao_dos_Valores_Valor_total_devido_emprestimo_ou_financiamento_ou_arrendamento_mercantil_financeiro_no_ato_da_contratacao_Percentual": "1111%",
				"Discriminacao_dos_Valores_Valor_total_devido_emprestimo_ou_financiamento_ou_arrendamento_mercantil_financeiro_no_ato_da_contratacao_Percentual_unformatted": "1111",
				"Discriminacao_dos_Valores_Valor_liberado_ao_cliente_vendedor_RS": "111,00",
				"Discriminacao_dos_Valores_Valor_liberado_ao_cliente_vendedor_RS_unformatted": "111.00",
				"Discriminacao_dos_Valores_Valor_liberado_ao_cliente_vendedor_Percentual": "11%",
				"Discriminacao_dos_Valores_Valor_liberado_ao_cliente_vendedor_Percentual_unformatted": "11",
				"Discriminacao_dos_Valores_Despesas_vinculadas_a_concessao_do_credito_RS": "1.111,00",
				"Discriminacao_dos_Valores_Despesas_vinculadas_a_concessao_do_credito_RS_unformatted": "1111.00",
				"Discriminacao_dos_Valores_Despesas_vinculadas_a_concessao_do_credito_Percentual": "111%",
				"Discriminacao_dos_Valores_Despesas_vinculadas_a_concessao_do_credito_Percentual_unformatted": "111",
				"Discriminacao_dos_Valores_Tarifa_da_emissao_de_contrato_RS": "11%",
				"Discriminacao_dos_Valores_Tarifa_da_emissao_de_contrato_RS_unformatted": "11",
				"Discriminacao_dos_Valores_Tarifa_de_emissao_de_contrato_Percentual": "11%",
				"Discriminacao_dos_Valores_Tarifa_de_emissao_de_contrato_Percentual_unformatted": "11",
				"Discriminacao_dos_Valores_Tributos_IOF_Fiat_RS": "11,00",
				"Discriminacao_dos_Valores_Tributos_IOF_Fiat_RS_unformatted": "11.00",
				"Discriminacao_dos_Valores_Tributos_IOF_Fiat_Percentual": "11%",
				"Discriminacao_dos_Valores_Tributos_IOF_Fiat_Percentual_unformatted": "11",
				"Discriminacao_dos_Valores_Tributos_IOF_Prazo_RS": "1,00",
				"Discriminacao_dos_Valores_Tributos_IOF_Prazo_RS_unformatted": "1.00",
				"Discriminacao_dos_Valores_Tributos_IOF_Prazo_Percentual": "1%",
				"Discriminacao_dos_Valores_Tributos_IOF_Prazo_Percentual_unformatted": "1",
				"Discriminacao_dos_Valores_Seguro_RS": "1,00",
				"Discriminacao_dos_Valores_Seguro_RS_unformatted": "1.00",
				"Discriminacao_dos_Valores_Seguro_Percentual": "1%",
				"Discriminacao_dos_Valores_Seguro_Percentual_unformatted": "1",
				"Discriminacao_dos_Valores_Outros_encargos_RS": "1,00",
				"Discriminacao_dos_Valores_Outros_encargos_RS_unformatted": "1.00",
				"Discriminacao_dos_Valores_Outros_encargos_Percentual": "111%",
				"Discriminacao_dos_Valores_Outros_encargos_Percentual_unformatted": "111",
				"_displayName": "Discriminação dos Valores",
				"_displayValue": "Discriminação dos Valores"
			},
			"Seguro_Safra_Prestamista_Empresarial_Num_do_Contrato": "111",
			"Seguro_Safra_Prestamista_Empresarial_Num_do_Contrato_unformatted": "111",
			"Dados_do_Contratante_Devedor_Estipulante": {
				"Dados_do_Contratante_Devedor_Estupulante_Ramo_de_Atividade": "Ramo de Atividade",
				"Dados_do_Contratante_Devedor_Estupulante_Telefone_para_Contato": "19999600702",
				"Dados_do_Contratante_Devedor_Estupulante_Telefone_para_Contato_unformatted": "19999600702",
				"_displayName": "Dados do Contratante/Devedor/Estipulante",
				"_displayValue": "Dados do Contratante/Devedor/Estipulante"
			},
			"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios": {
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Taxas": "11%",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Taxas_unformatted": "11",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Num": "111",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Num_unformatted": "111",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Comissao_de_Corretagem": "22%",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Comissao_de_Corretagem_unformatted": "22",
				"Comissao_Corretagem_Tipo_Avista_no_valor_de_RS_XXX": "True",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Parcelado_No_ato_de_RS_XXX_e_em_X_parcelas_mensais_de_RS_XXX_a_cada_30_dias": "",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Avista_no_valor_de_RS_XXX_por_intermedio_do_CREDOR_sendo_seu_valor_financiado_pelo_CREDOR_e_agregado_ao_valor_da_Obrigacao": "",
				"Avista_no_valor_de_RS_XXX_Valor": "100.000,00",
				"Avista_no_valor_de_RS_XXX_Valor_unformatted": "100000.00",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Declaracao_de_Saude": {
					"_key": "Concordo",
					"__text": "Concordo"
				},
				"Condicoes_Gerais_Radio": {
					"_key": "Dispenso",
					"__text": "Dispenso"
				},
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Conta_Corrente": "11111",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Conta_Corrente_unformatted": "11111",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Codigo_de_Producao": "2221",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Codigo_de_Producao_unformatted": "2221",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Nome_do_Corretor": "1212",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_CNPJ": "69.402.252/0001-43",
				"Dados_do_Seguro_Safra_Pretamista_Empresarial_Integral_Mutuo_Socios_Codigo_SUSEP": "12154510",
				"_displayName": "Dados do Seguro Safra Pretamista Empresarial Integral Mútuo Sócios",
				"_displayValue": "Dados do Seguro Safra Pretamista Empresarial Integral Mútuo Sócios"
			},
			"_displayName": "",
			"_displayValue": "",
			"_mergedDocumentUid": "a57948ce-06a0-ee11-b842-48df378a7098"
		}
	}
}
let representanteCli = []
let representantesAvalista = []

let avalistaDIV = document.getElementById("avalistas")
let terceirosDIV = document.getElementById("terceiros")

const clientesDiv = document.getElementById("clienteContainer").parentElement
let contadorRepCli = 1

const url = "http://localhost:3000/safra/representantes"


emitente = data.Params.TemplateFieldData.Emitente
terceiroGarantidor = data.Params.TemplateFieldData.Terceiro_Garantidor.Tabela_Terceiro_Garantidor_Container.Tabela_Terceiro_Garantidor
avalistasTable = data.Params.TemplateFieldData.Avalistas.Tabela_Avalistas_Container.Tabela_Avalistas

$.ajax({
	url: url,
	method: 'POST',
	data: JSON.stringify(data),
	headers: {
		'Accept': '*/*',
		"Content-Type": "application/json"
	},
}).done(res => {
	let {
		data
	} = res
	console.log("DATAA", res)

	representanteCli = data.find(el => el.documentoCliente == emitente.Emitente_CNPJ.replace(/[^\w\s]/gi, '')).agrupamentoRepresentantes
	console.log("REPRESENTNTE", representanteCli)

	let avalistasCNPJ = avalistasTable.map(el => el.Avalistas_CPF_CNPJ.replace(/[^\w\s]/gi, ''))
	let avalistas = data.filter(el => avalistasCNPJ.includes(el.documentoCliente))
	let terceirosCNPJ = avalistasTable.map(el => el.Avalistas_CPF_CNPJ.replace(/[^\w\s]/gi, ''))
	let terceiros = data.filter(el => terceirosCNPJ.includes(el.documentoCliente))
	console.log("AQUIII", representanteCli)
	preencherLists(representanteCli, clientGrupos)
	preencherAvalistas(avalistas)
	preencherTerceiros(terceiros)
	console.log(avalistasTable, terceiroGarantidor, emitente)
})


function addClient(event, id, cloneParam, representante = {}) {
	try {
		let clone = document.getElementById(id).cloneNode(true)

		if (representante.nome) {
			clone.children[0].children[1].value = representante.nome
			clone.children[1].children[1].value = representante.documento
			clone.children[2].children[1].value = representante.emailContatoAssinatura
		}
		// console.log("aQUIIII", clone.children[2].children[0].children[2].children[0])
		clone.removeAttribute("hidden")

		let buttomremove = clone.children[3].children[0].children[2].children[0]

		buttomremove.addEventListener("click", (event) => {
			remove(event)
		})
		clone.children[0].children[1].addEventListener("blur", preencherAutomatico)
		contadorRepCli++
		clone.id = "representante" + contadorRepCli
		console.log("adcioonando", clone)
		return clone

	} catch (error) {
		console.log(error)
	}
}

function remove(event) {
	let self = event.target
	const container = self.parentElement.parentElement.parentElement.parentElement
	console.log(container)
	container.remove()
}

buttonCli.addEventListener("click", function (event) {
	const clone = addClient(event, "clienteContainer0")
	buttonCli.parentElement.parentElement.parentElement.children[1].appendChild(clone)
})


let changeGroups = (self, representantesArray, button, idContainer, gruposDiv) => {
	console.log("REPRESENTANTES ", button.parentElement.parentElement.parentElement.children.length)
	if (button.parentElement.parentElement.parentElement.children.length >= 3) {
		button.parentElement.parentElement.parentElement.children[1].innerHTML = ""
	}


	let value = self.value
	let condEespecial = self.options[self.selectedIndex].getAttribute("condeespecial")
	let label = self.parentElement.children[0]
	if (condEespecial == "true")
		label.innerHTML = '<p style="color:tomato">Grupos Condicao Especial</p>'
	else
		label.innerHTML = '<p>Grupos</p>'

	let representantes = representantesArray.find(el => el.nomeAgrupamento == self.value).representantes

	console.log("REP0 ", representantes)

	representantes.forEach(representante => {
		const clone = addClient(null, idContainer, false, representante)
		document.getElementById(gruposDiv).appendChild(clone)
	})


}
clientGrupos.addEventListener("change", function () {
	changeGroups(this, representanteCli, buttonCli, "clienteContainer0", "gruposDiv")

})
document.getElementById("nome-representante").addEventListener("blur", preencherAutomatico)
document.getElementById("nome-representante-terceiros").addEventListener("blur", preencherAutomatico)

function preencherAutomatico() {
	console.log(this.parentElement.parentElement.parentElement.parentElement)
	let value = this.value
	let cpf = this.parentElement.parentElement.children[1].children[1]
	let email = this.parentElement.parentElement.children[2].children[1]
	let label = this.parentElement.parentElement.children[0].children[0]
	console.log("LABEELL", label)
	const options = Array.from(clientList.options).find(el => el.value == value)
	let condEespecial = options.getAttribute("condEespecial")
	if (condEespecial == "true")
		label.innerHTML = '<p style="color:tomato">Representantes Condicao Especial</p>'
	else
		label.innerHTML = '<p>Representantes</p>'

	if (!value) {
		email.value = ""
		cpf.value = ""
		label.innerHTML = '<p>Representantes</p>'
	} else {
		email.value = options.getAttribute("email")
		cpf.value = options.getAttribute("cpf")
	}
}

function preencherLists(array, listName, listEmail, listCpf) {
	console.log("ARRAyy", array)
	array.forEach((el, index) => {
		listName.innerHTML += `<option condEespecial="${el.indicadorCondicaoEspecial}" name="${index}" value="${el.nomeAgrupamento
				}">${el.nomeAgrupamento
				}</option>`
	})
}

function preencherAvalistas(avalistas) {
	avalistas.forEach((el, index) => {
		const clone = document.getElementById("avalistas0").cloneNode(true)
		clone.removeAttribute("hidden")
		let addButton = clone.children[1].children[3].children[0].children[0]
		console.log(el)
		const avalista = avalistasTable.find(avalista => avalista.Avalistas_CPF_CNPJ == el.documentoCliente)
		console.log("NOMWE", avalista)
		let nome = avalista.Avalistas_Nome_Razao_Social
		clone.id = nome
		clone.children[0].innerText = nome
		const inputNameList = clone.children[1].children[0].children[0].children[1]

		avalistaDIV.appendChild(clone)
		let selectGroups = clone.children[1].children[0].children[0].children[1]
		avalistaDiv = clone.children[1].children[1].id = "gruposAvalistaDiv" + el.documentoCliente
		console.log("AVALISTAS ", avalista)
		selectGroups.addEventListener("change", function () {
			changeGroups(this, el.agrupamentoRepresentantes, addButton, "avalistaContainer0", "gruposAvalistaDiv" + el.documentoCliente)
		})
		addButton.addEventListener("click", function (event) {
			console.log(clone)
			const cloneCli = addClient(event, "avalistaContainer0", true)

			console.log("Clone cli", cloneCli)
			cloneCli.setAttribute("style", "margin-bottom: 20px")

			addButton.parentElement.parentElement.parentElement.children[1].appendChild(cloneCli)
		
		})


		// inputName.addEventListener("blur", preencherAutomatico)
		let representantesAvalista = el.agrupamentoRepresentantes

		preencherLists(representantesAvalista, inputNameList)

	})
}

function maketableCli(array, anchor) {
	let xml = ""

	array.forEach((el, index) => {
		
		xml += "<signers>"
		let nome = el.children[0].children[1].value
		let cpf = el.children[1].children[1].value
		let email = el.children[2].children[1].value
		let tipoASs = el.children[3].children[0].children[1].children[0].value
		let tag = anchor + (index + 1)
		xml += "<nome>" + nome + "</nome>"
		xml += "<email>" + email + "</email>"
		xml += "<cpf>" + cpf + "</cpf>"
		xml += "<tag>" + tag + "</tag>"
		xml += "<tipoASs>" + tipoASs + "</tipoASs>"
		console.log(el)
		xml += "</signers>"
	})
	return xml
}

function maketable(array, anchor) {
	let xml = ""
	let indexFull = 1

	array.forEach((element, index, array) => {
		if (index > 0) {
			let representantes = Array.from(element.children[1].children[1].children)
			console.log("TESTEE", representantes)

			representantes.forEach((el, i) => {
				xml += "<signers>"
				let nome = el.children[0].children[1].value
				let cpf = el.children[1].children[1].value
				let email = el.children[2].children[1].value
				let tipoASs = el.children[3].children[0].children[1].children[0].value
				let tag = anchor + (indexFull)
				xml += "<nome>" + nome + "</nome>"
				xml += "<email>" + email + "</email>"
				xml += "<cpf>" + cpf + "</cpf>"
				xml += "<tag>" + tag + "</tag>"
				xml += "<tipoASs>" + tipoASs + "</tipoASs>"
				xml +=  "<role> Representante do Emitente  </role>"

				console.log(el)
				xml += "</signers>"
				indexFull++

			})
		}
	})
	return xml
}
const buttonSave = document.getElementById("ctl00_MainContent_buttonGroup_btnDone")

function makeXml() {
	try {
		let containerCli = Array.from(document.querySelectorAll("#nome-representante")[0].parentElement.parentElement.parentElement.children)
		let containerAvalistas = Array.from(document.getElementById("avalistas").children)
		let containerTerceiros = Array.from(document.getElementById("terceiros").children)

		console.log("CONTAINER", containerCli)
		let xml = "<recipients>"
		
		xml += maketableCli(containerCli, "emitente")
		xml += maketable(containerTerceiros, "tercgc")
		xml += maketable(containerAvalistas, "aval")

		xml += "</recipients>"
		document.getElementById("xml").value = xml
		return xml
	} catch (error) {
		console.log(error)
	}
}

window.make = makeXml

function preencherTerceiros(avalistas) {
	avalistas.forEach((el, index) => {
		const clone = document.getElementById("avalistas0").cloneNode(true)
		clone.removeAttribute("hidden")
		let addButton = clone.children[1].children[3].children[0].children[0]
		console.log(el)
		const avalista = avalistasTable.find(avalista => avalista.Avalistas_CPF_CNPJ == el.documentoCliente)
		console.log("NOMWE", avalista)
		let nome = avalista.Avalistas_Nome_Razao_Social
		clone.id = nome
		clone.children[0].innerText = nome
		const inputNameList = clone.children[1].children[0].children[0].children[1]

		terceirosDIV.appendChild(clone)
		let selectGroups = clone.children[1].children[0].children[0].children[1]
		avalistaDiv = clone.children[1].children[1].id = "gruposTerceirosDiv" + el.documentoCliente
		console.log("AVALISTAS ", avalista)
		selectGroups.addEventListener("change", function () {
			changeGroups(this, el.agrupamentoRepresentantes, addButton, "tericeiroContainer0", "gruposTerceirosDiv" + el.documentoCliente)
		})
		addButton.addEventListener("click", function (event) {
			console.log(clone)
			const cloneCli = addClient(event, "tericeiroContainer0", true)

			console.log("Clone cli", cloneCli)
			cloneCli.setAttribute("style", "margin-bottom: 20px")

			addButton.parentElement.parentElement.parentElement.children[1].appendChild(cloneCli)
		})


		// inputName.addEventListener("blur", preencherAutomatico)
		let representantesAvalista = el.agrupamentoRepresentantes

		preencherLists(representantesAvalista, inputNameList)

	})
}
buttonSave.addEventListener("mouseover", function () {
	console.log("ATIVANDO MOUSE OVER")
	makeXml()
})