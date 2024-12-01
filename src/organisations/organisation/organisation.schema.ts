import { randomUUID, UUID } from "crypto";
import { OrganisationDTO } from "./organisation.dto";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type OrganisationDocument = HydratedDocument<Organisation>;

@Schema()
export class Organisation{

  @Prop({ immutable: true, required: true})
  _id: UUID;

  @Prop({immutable: true, required: true})
  userName: string;

  @Prop({required: true})
  password: string;

  constructor(clientDTO?: OrganisationDTO){
    if(clientDTO){
      this._id = randomUUID();
      this.userName = clientDTO.userName;
      this.password = clientDTO.password;
    }
  }
};

export const OrganisationSchema = SchemaFactory.createForClass(Organisation);
