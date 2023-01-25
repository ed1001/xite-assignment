# Getting Started

To start the app in development mode run the following in the project root directory:

### `yarn start`

To run an optimised prod version run:

### `yarn serve-prod`

The app will be served at: [http://localhost:3000](http://localhost:3000)

# About

### Visualise, search and inspect Track, Artist and Genre data and create and edit playlists

The UI is made up of 2 main parts: The **explorer** and the **Inspector**.

### The Explorer

- This is the main pane that you'll see when opening the app; 
here you can list your data, without a search it will display all the data 
for a given category but you can also search the lists with the search bar 
located in the top right corner of the explorer.
- Choose a category to search by clicking the sidebar on the left of the screen.
- The results are paginated so if you receive more than 50 results for a given 
search you can load more by clicking the "load more" button to the bottom 
right of the explorer.

![explorer.gif](gif%2Fexplorer.gif)

### The Inspector

- This is where you can view data in more detail and also edit your playlists.
- To open the inspector simply click on any entry in the explorer, you can also open and 
close using the arrow icon in the top right corner.
- For tracks you'll see all its details here, for artists and genres you'll see the latest 
20 tracks by that artist or in that genre.
- You can inspect multiple items at a time, you'll see items displayed as tabs at the top,
here you can select and also remove items from the inspector.

![inspector.gif](gif%2Finspector.gif)

### Playlists

- To create a playlist either click the "create playlist +" button next to the search bar in 
the playlists list or find a track you'd like to add to a new playlist and click the add to 
playlist icon button and select "create playlist".
- When a playlist is created it will automatically be opened in the inspector, here you can
edit the name of the playlist and also delete it if needed.
- To add tracks to a playlist you can drag and drop tracks from the explorer into the playlist 
that's open in the inspector.
- 
![playlists.gif](gif%2Fplaylists.gif)

# Technical notes

- Uses react query as a global state manager. Fetches tracks for xite api then derives all other data from there, 
this kind of emulates a database. Of course not how it would be in the real situation, but worked for what I wanted 
to achieve with just one endpoint given.  
- I was initially using IndexedDb as a way to persist application state such as playlists but noticed that it was
behaving in a stable manner so chose to omit persistance in the final version as I didn't have time left to properly 
look into and fix this. Currently the data is flushed on page refresh.
