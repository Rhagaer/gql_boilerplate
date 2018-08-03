import { Entity, ObjectIdColumn, ObjectID, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn() id!: ObjectID;

  //Good to have a max to prevent people from making really big emails
  @Column("varchar", { length: 255 })
  email!: string;

  @Column("text") password!: string;

  //Executes right before the object is added
  // @BeforeInsert()
  // addId(){

  // }
}
