export async function getNomeFuncionarioById(id) {
  try {
    const response = await fetch(`/api/funcionarios?id=${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }

    const funcionario = await response.json();
    return funcionario.nome + " " + funcionario.sobrenome;
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error);
    return null;
  }
}