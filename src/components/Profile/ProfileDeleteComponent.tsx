import React, {Component} from "react";
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button";
import * as database from "../../data/database";
import {IPlayer} from "../../data/interfaces";
import Alert, {SweetAlertResult} from 'sweetalert2'

interface IProps {
    player: IPlayer
}

class ProfileDeleteComponent extends Component<IProps, any> {

    /**
     * Delete the user profile. This is dony by calling database.deletePlayer
     * This requires the player prop to have the correct player object.
     * Will also display an error popup if database operation fails
     */
    private async onDeleteClick(): Promise<void> {
        let res: SweetAlertResult = await Alert.fire({
            title: "Please confirm",
            text: "This action cannot be reversed!",
            confirmButtonText: "Confirm",
            showCancelButton: true,
            type: "warning"
        });
        
        if (!res.value) return;
        
        try {
            await database.deletePlayer(this.props.player);
            window.location.reload();
        } catch (e) {
            console.log(e);
            Alert.fire({
                title: e.name,
                text: e.message,
                confirmButtonText: "OK",
                type: "error"
            })
        }
    }
    
    public render(): React.ReactNode {
        return (
            <Card.Body>
                <Card.Title>Delete your profile</Card.Title>
                <p>
                    It is possible to delete your profile. Deleting your profile will also remove any leaderboard related data!
                </p>
                <p>
                    Please note that you will be unable to access the site again unles you create a new account!.
                </p>
                <strong className="text-danger">THIS PROCESS CANNOT BE REVERSED!</strong><br/><br/>
                <Button variant="danger" onClick={() => this.onDeleteClick()}>DELETE PROFILE</Button>
            </Card.Body>
        );
    }
}

export default ProfileDeleteComponent;