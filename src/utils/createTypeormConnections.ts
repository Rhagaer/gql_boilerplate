import { createConnection, getConnectionOptions } from "typeorm";

export const createTypeormConnection = async () => {
  const environment = process.env.NODE_ENV || "development";
  console.log(environment);
  const connectionOptions = await getConnectionOptions(environment);

  //Looks at the node environment and corelates to the name of the database in ormconfig
  return createConnection({ ...connectionOptions, name: "default" });
};
