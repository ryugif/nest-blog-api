import { Column, DataType, Table, Model } from "sequelize-typescript";

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
    public priority: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    public readAt?: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    public sendAt?: string;

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