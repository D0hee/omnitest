# Omni Supabase App

## Overview
Omni Supabase App is a secure file sharing platform that utilizes Supabase as its backend service. This application allows users to upload and download files seamlessly while managing user authentication and file history.

## Project Structure
```
omni-supabase-app
├── public
│   └── index.html          # Main HTML entry point
├── src
│   ├── main.js             # Main JavaScript file for application logic
│   ├── supabaseClient.js   # Supabase client initialization
│   └── utils.js            # Utility functions for the application
├── package.json             # NPM configuration and dependencies
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd omni-supabase-app
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a Supabase project at [Supabase.io](https://supabase.io).
   - Obtain your Supabase URL and public API key from the project settings.
   - Update the `src/supabaseClient.js` file with your Supabase credentials.

4. **Run the Application**
   You can start the application using:
   ```bash
   npm start
   ```

5. **Access the Application**
   Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage
- **Upload Files**: Users can upload files to share with others.
- **Download Files**: Users can download files shared with them.
- **User Authentication**: Users can create accounts and log in to manage their files.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.