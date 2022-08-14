# Summer-Olympics-By-Gender-Visualiztion

http://34.66.223.151/~a5/SummerOlympicsVisualizationByGender/index.html

Olympics from a different prespective - Male and Female achievments along the olympics.

In most of the visualizations which I have encountered, the viz discussed about comparisons between Countries Medal tally without regards to gender,
so i find it intersting to see if there are any differences and what are they when we examine this aspect.

The original dataset is from kaggle - https://www.kaggle.com/datasets/heesoo37/120-years-of-olympic-history-athletes-and-results
which contains every athlete that participated in the olympics (summer and winter) and their stats (physical, sport type and medal type or none)
I had to manipulate the data With R ,clean it and aggregate by Year, country and gender.

during the work, I noticed that there are way less female participants in the early 20th century olympics and a normalization ratio is required
female medal ratio - female medal winners/ total female participants in this country
male medal ratio - male medal winners/ total male participants in this country
*Ratio* - female medal ratio/male medal ratio
so when ratio > 1 it's means that female achieve better in this country, and ratio < 1 - male achieve better results

This project was selected as top project of the course Information Visualization.

http://34.66.223.151/~a5/SummerOlympicsVisualizationByGender/index.html


<img width="944" alt="image" src="https://user-images.githubusercontent.com/88659243/184530257-e30b7456-d041-415b-93da-70d50987bb66.png">


You can switch olympic with the time slider.
the map controls all other plots in the page, we can take a look on specific country over the years, or compare multiple countries.
The viz is highly interactive.
