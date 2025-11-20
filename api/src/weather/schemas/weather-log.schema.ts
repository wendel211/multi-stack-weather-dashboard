import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class WeatherLog {
  @Prop()
  temperature: number;

  @Prop()
  humidity: number;

  @Prop()
  wind_speed: number;

  @Prop()
  condition: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export type WeatherLogDocument = WeatherLog & Document;
export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
