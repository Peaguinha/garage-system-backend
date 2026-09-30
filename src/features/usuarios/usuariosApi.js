import { graphqlRequest } from "../../shared/api/graphqlClient";

// query { usuarios { id nome email role } } — restrita a ADMIN no backend
// (ver backend/src/graphql/resolvers.js, Query.usuarios).
const USUARIOS_QUERY = `
  query Usuarios {
    usuarios {
      id
      nome
      email
      role
    }
  }
`;

export const usuariosApi = {
  list: async () => {
    const data = await graphqlRequest(USUARIOS_QUERY);
    return data.usuarios;
  },
};
