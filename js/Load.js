import { Database } from "../database_server.js";

window.onload = () => {

    if ( sessionStorage.getItem('Database_Users') == null ) {

        Database.Read_Data( 'Database_Users', 'Users' );

    };

    Load();

};

function Load() {

    if ( sessionStorage.getItem( 'Database_Users' ) == null ) {

        setTimeout( Load, 2000 );

    } else {

        window.location.assign( './index.html' );

    };    
};