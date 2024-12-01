import { UUID } from "crypto";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ClientRecordDocument = HydratedDocument<ClientRecord>;

@Schema()
export class ClientRecord {

  @Prop({ immutable: true, required: true})
  _id: UUID;

  @Prop({ immutable: true, required: true, type: mongoose.Schema.Types.String, ref: 'Organisation' })
  organisationId: string;

  @Prop({ immutable: true, required: true })
  clientId: string;

  @Prop({ required: true })
  sinceFrom: Date;
}

export const ClientRecordSchema = SchemaFactory.createForClass(ClientRecord);