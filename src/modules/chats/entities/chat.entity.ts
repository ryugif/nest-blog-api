import { Column, DataType, Table, Model } from "sequelize-typescript";
import { ChatPriority, MessageType, SenderType } from "../../../enums/chat.enum";

@Table({
    timestamps: true,
    paranoid: true,
})

export class Chat extends Model<Chat> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true
    })
    public id?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    public content: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    public telephone: string;

    @Column({
        type: DataType.ENUM('HIGH', 'MEDIUM', 'LOW'),
        allowNull: false,
        defaultValue: 'LOW'
    })
    public priority: ChatPriority;

    @Column({
        type: DataType.ENUM('text', 'media'),
        allowNull: false,
        defaultValue: 'text'
    })
    public message_type: MessageType;

    @Column({
        type: DataType.ENUM('user', 'customer', 'bot'),
        allowNull: false,
        defaultValue: 'user'
    })
    public sender_type: SenderType;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public raw_time: number;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    public receive_at?: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    public read_at?: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    public send_at?: string;

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    public customer_id: string;

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    public user_id: string;
}