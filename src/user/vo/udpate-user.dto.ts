import {  IsNotEmpty } from "class-validator";

export class UpdateUserDto {

    headPic: string;

    @IsNotEmpty({
         message: '昵称不能为空'
    })
    nickName: string;
    
 
}
