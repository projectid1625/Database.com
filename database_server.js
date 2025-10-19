// import database_users -->

const WEB_APP_URL ="https://script.google.com/macros/s/AKfycbx0IexxamD_hdhmusdY_B71s9N6RpTJ81JnRtFNoQmgjT6y9C5xqeu9j4idrSA1CDwD/exec";

const Database = {

    request_url: WEB_APP_URL,

    Send_request: ( data_type, store_data, _arguments_ ) => {

        const request = new XMLHttpRequest();

        request.open( "GET", Database.request_url + '?type=' + data_type + _arguments_ );

        request.onload = () => { sessionStorage.setItem( store_data, request.responseText ); };

        request.send( null );

    },

    Read_Data: ( data_location, category ) => {

        Database.Send_request( 'Read', data_location, '&category=' + category );

    },

    Update_Data: ( category, cell, data ) => {

        const uri_data = encodeURIComponent(data);

        Database.Send_request( 'Update', 'DATABASE', '&category=' + category + '&cell=' + cell
        + '&status=100' + '&data=' + uri_data );

    },

    Update_Multi_Data: ( category, cell, data ) => {

        Database.Send_request( 'Update', 'DATABASE', '&category=' + category + '&cell=' + cell
        + '&status=200' + '&data=' + data );

    },

    Create_Data: ( category, data ) => {

        const uri_data = data.map( item => encodeURIComponent(item) );

        Database.Send_request( 'Create', 'DATABASE', '&category=' + category + '&data=' +
        Database.Json.stringify( uri_data ) );

    },

    Delete_Data: ( category, cell ) => {

        Database.Send_request( 'Delete', 'DATABASE', '&category=' + category + '&cell=' + cell );

    },

    Delete_Database: ( api_key ) => {

        Database.Send_request( 'Delete_Database', 'DATABASE', '&api=' + api_key );

    }, Update_Owners: ( indexs, owner ) => {

        indexs = indexs.join(',');

        Database.Send_request( 'Update_Owners', 'DATABASE', '&indexs=' + indexs + '&owner=' + owner );

    },

    Json: {

        parse: ( Data ) => {

            var new_text = '';
            var new_array = new Array();

            for ( var a = 1; a < Data.length - 1; a++ ) {

                if ( Data.charAt( a ) == '~' ) { new_array.push( new_text ); new_text = ''; }
                else if ( Data.charAt( a ) == '`' ) { new_text += ' '; }
                else { new_text += Data.charAt( a ); }

            }; new_array.push( new_text ); return new_array;

        },

        stringify: ( data ) => {

            var text = '';
            var changed_data = new Array();

            for ( var d = 0; d < data.length; d++ ) { data[ d ] = ( data[ d ] ).toString(); };

            for ( var b = 0; b < data.length; b++ ) {

                text = '';

                for ( var c = 0; c < data[ b ].length; c++ ) {

                    if ( data[ b ].charAt( c ) == ' ' ) { text += '`' }
                    else { text += data[ b ].charAt( c ); }

                }; changed_data.push( text );

            }; data = changed_data; changed_data = null;
            
            var new_data = '[';

            for ( var a = 0; a < data.length - 1; a++ ) {
                
                new_data += data[ a ];
                new_data += '~';

            }; new_data += data[ data.length - 1 ] + ']';

            return new_data;

        },

        Stringify_Column: ( Column_Name, data_location ) => {

            if ( sessionStorage.getItem( data_location ) == null ) { return -1; };

            var data = JSON.parse( sessionStorage.getItem( data_location ) );

            data = data[ 0 ];

            data = Object.keys( data ).indexOf( Column_Name );

            if ( data < 0 || data >= Database.Json.alphabets.length ) { return -1; };

            return Database.Json.alphabets[ data ];

        },

        alphabets: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    }

};

export { Database, WEB_APP_URL };
