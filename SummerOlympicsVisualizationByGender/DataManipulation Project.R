dat <- read.csv("athlete_events.csv",header = T)
View(dat)
install.packages("tidyverse")
install.packages("ggplot2")
library(dplyr)
library(tidyverse)
library(ggplot2)
dat <- dat %>% filter(Season=="Summer")
a <- dat %>% group_by(Year,NOC, Team) %>% summarize(n = n())
D <- dat %>% group_by(Year, NOC, Team) %>%
  summarize(Gold = sum(Medal=="Gold"), Silver = sum(Medal=="Silver"), Bronze = sum(Medal=="Bronze")
            ,MaleMedals = sum(Sex=="M" & (Medal == "Gold" | Medal == "Silver" | Medal == "Bronze"))
            ,FemaleMedals = sum(Sex=="F" & (Medal == "Gold" | Medal == "Silver" | Medal == "Bronze"))
            ,Male = sum(Sex=="M"), Female = sum(Sex=="F"))
View(D)
typeof(dat$Medal)
D <- cbind(D,athletes=a$n)
D <- cbind(D,MaleMedalsRatio = D$MaleMedals/D$Male, FemaleMedalRatio = D$FemaleMedals/D$Female)
dat$Medal[which(is.na(dat$Medal))] <- "No"
View(dat)
install.packages("countrycode")
library(countrycode)
D$Ratio <- D$FemaleMedalRatio/D$MaleMedalsRatio
D$FemaleMedalRatio[which(is.nan(D$FemaleMedalRatio))] <- 0
D$Ratio[which(is.nan(D$Ratio))] <- 0
D$Continent <- countrycode(sourcevar = df[, "Team"],
                            origin = "country.name",
                            destination = "continent")
df <- data.frame(D)
View(df)
az <- df[which(is.na(df$Continent)),]
View(az)
df <- df[-which(is.na(df$Continent)),]
df$Ratio[which(df$Ratio==Inf)] <- 100
which.max(D$Ratio)
df$MaleMedalsRatio[which(is.nan(df$MaleMedalsRatio))] <- 0
install.packages("ISOcodes")
library(ISOcodes)
ISOcodes::UN_M.49_Countries


data("UN_M.49_Regions")
data("UN_M.49_Countries")
region <- subset(UN_M.49_Regions, Name == "Southern Europe")
codes <- unlist(strsplit(region$Children, ", "))
subset(UN_M.49_Countries, Code %in% codes)
codes
m49 <- UN_M.49_Countries
intersect(m49$Name,E$Team)
length(unique(df$Team))
sum(is.na(df$Ratio))
df$Ratio[which(df$FemaleMedalRatio==0 & df$MaleMedalsRatio==0)] <- -1
View(df)
df$TotalMedals <- df$MaleMedals + df$FemaleMedals
unique(dat$Sport)

E <- dat %>% group_by(Year, NOC, Team) %>%
  summarize(Gold = sum(Medal=="Gold"), Silver = sum(Medal=="Silver"), Bronze = sum(Medal=="Bronze")
            ,MaleGoldMedals = sum(Sex=="M" & Medal == "Gold")
            ,MaleSilverMedals = sum(Sex=="M" & Medal == "Silver")
            ,MaleBronzeMedals = sum(Sex=="M" & Medal == "Bronze")
            ,FemaleGoldMedals = sum(Sex=="F" & Medal == "Gold")
            ,FemaleSilverMedals = sum(Sex=="F" & Medal == "Silver")
            ,FemaleBronzeMedals = sum(Sex=="F" & Medal == "Bronze")
            ,FemaleMedals = sum(Sex=="F" & (Medal == "Gold" | Medal == "Silver" | Medal == "Bronze"))
            ,Male = sum(Sex=="M"), Female = sum(Sex=="F"))

write.csv(pp,"OlympicData.csv")
df <- df[-which(df$Year==1906),]
df$Continent[which(df$Continent=="Americas")] <- "America"
View(df)


##-----------------------------------------------------------------------------------##

df$Team[which(df$NOC == "AFG")] <- "Afghanistan"
df$Team[which(df$NOC == "ALB")] <- "Albania"
df$Team[which(df$NOC == "ALG")] <- "Algeria"
df$Team[which(df$NOC == "AND")] <- "Andorra"
df$Team[which(df$NOC == "ANG")] <- "Angola"
df$Team[which(df$NOC == "ANT")] <- "Antigua and Barbuda"
df$Team[which(df$NOC == "ARG")] <- "Argentina"
df$Team[which(df$NOC == "ARM")] <- "Armenia"
df$Team[which(df$NOC == "ARU")] <- "Aruba"
df$Team[which(df$NOC == "ASA")] <- "American Samoa"
df$Team[which(df$NOC == "AUS")] <- "Australia"
df$Team[which(df$NOC == "AUT")] <- "Austria"
df$Team[which(df$NOC == "AZE")] <- "Azerbaijan"
df$Team[which(df$NOC == "BAH")] <- "Bahamas"
df$Team[which(df$NOC == "BAN")] <- "Bangladesh"
df$Team[which(df$NOC == "BAR")] <- "Barbados"
df$Team[which(df$NOC == "BDI")] <- "Burundi"
df$Team[which(df$NOC == "BEL")] <- "Belgium"
df$Team[which(df$NOC == "BEN")] <- "Benin"
df$Team[which(df$NOC == "BER")] <- "Bermuda"
df$Team[which(df$NOC == "BHU")] <- "Bhutan"
df$Team[which(df$NOC == "BIH")] <- "Bosnia and Herzegovina"
df$Team[which(df$NOC == "BIZ")] <- "Belize"
df$Team[which(df$NOC == "BLR")] <- "Belarus"
df$Team[which(df$NOC == "BOL")] <- "Bolivia"
df$Team[which(df$NOC == "BOT")] <- "Botswana"
df$Team[which(df$NOC == "BRA")] <- "Brazil"
df$Team[which(df$NOC == "BRN")] <- "Bahrain"
df$Team[which(df$NOC == "BRU")] <- "Brunei"
df$Team[which(df$NOC == "BUL")] <- "Bulgaria"
df$Team[which(df$NOC == "BUR")] <- "Burkina Faso"
df$Team[which(df$NOC == "CAF")] <- "Central African Republic"
df$Team[which(df$NOC == "CAM")] <- "Cambodia"
df$Team[which(df$NOC == "CAN")] <- "Canada"
df$Team[which(df$NOC == "CAY")] <- "Cayman Islands"
df$Team[which(df$NOC == "CGO")] <- "Republic of the Congo"
df$Team[which(df$NOC == "CHA")] <- "Chad"
df$Team[which(df$NOC == "CHI")] <- "Chile"
df$Team[which(df$NOC == "CHN")] <- "China"
df$Team[which(df$NOC == "CIV")] <- "Ivori Coast"
df$Team[which(df$NOC == "CMR")] <- "Cameroon"
df$Team[which(df$NOC == "COD")] <- "Democratic Republic of the Congo"
df$Team[which(df$NOC == "COK")] <- "Cook Islands"
df$Team[which(df$NOC == "COL")] <- "Colombia"
df$Team[which(df$NOC == "COM")] <- "Comoros"
df$Team[which(df$NOC == "CPV")] <- "Cape Verde"
df$Team[which(df$NOC == "CRC")] <- "Costa Rica"
df$Team[which(df$NOC == "CRO")] <- "Croatia"
df$Team[which(df$NOC == "CUB")] <- "Cuba"
df$Team[which(df$NOC == "CYP")] <- "Cyprus"
df$Team[which(df$NOC == "CZE")] <- "Czech Republic"
df$Team[which(df$NOC == "DEN")] <- "Denmark"
df$Team[which(df$NOC == "DJI")] <- "Djibouti"
df$Team[which(df$NOC == "DMA")] <- "Dominica"
df$Team[which(df$NOC == "DOM")] <- "Dominican Republic"
df$Team[which(df$NOC == "ECU")] <- "Ecuador"
df$Team[which(df$NOC == "EGY")] <- "Egypt"
df$Team[which(df$NOC == "ERI")] <- "Eritrea"
df$Team[which(df$NOC == "ESA")] <- "El Salvador"
df$Team[which(df$NOC == "ESP")] <- "Spain"
df$Team[which(df$NOC == "EST")] <- "Estonia"
df$Team[which(df$NOC == "ETH")] <- "Ethiopia"
df$Team[which(df$NOC == "FIJ")] <- "Fiji"
df$Team[which(df$NOC == "FIN")] <- "Finland"
df$Team[which(df$NOC == "FRA")] <- "France"
df$Team[which(df$NOC == "FSM")] <- "Federated States of Micronesia"
df$Team[which(df$NOC == "GAB")] <- "Gabon"
df$Team[which(df$NOC == "GAM")] <- "Gambia"
df$Team[which(df$NOC == "GBR")] <- "United Kingdom"
df$Team[which(df$NOC == "GBS")] <- "Guinea Bissau"
df$Team[which(df$NOC == "GEO")] <- "Georgia"
df$Team[which(df$NOC == "GEQ")] <- "Equatorial Guinea"
df$Team[which(df$NOC == "GER")] <- "Germany"
df$Team[which(df$NOC == "GHA")] <- "Ghana"
df$Team[which(df$NOC == "GRE")] <- "Greece"
df$Team[which(df$NOC == "GRN")] <- "Grenada"
df$Team[which(df$NOC == "GUA")] <- "Guatemala"
df$Team[which(df$NOC == "GUI")] <- "Guinea"
df$Team[which(df$NOC == "GUM")] <- "Guam"
df$Team[which(df$NOC == "GUY")] <- "Guyana"
df$Team[which(df$NOC == "HAI")] <- "Haiti"
df$Team[which(df$NOC == "HKG")] <- "Hong Kong"
df$Team[which(df$NOC == "HON")] <- "Honduras"
df$Team[which(df$NOC == "HUN")] <- "Hungary"
df$Team[which(df$NOC == "INA")] <- "Indonesia"
df$Team[which(df$NOC == "IND")] <- "India"
df$Team[which(df$NOC == "IRI")] <- "Iran"
df$Team[which(df$NOC == "IRL")] <- "Ireland"
df$Team[which(df$NOC == "IRQ")] <- "Iraq"
df$Team[which(df$NOC == "ISL")] <- "Iceland"
df$Team[which(df$NOC == "ISR")] <- "Israel"
df$Team[which(df$NOC == "ISV")] <- "United States Virgin Islands"
df$Team[which(df$NOC == "ITA")] <- "Italy"
df$Team[which(df$NOC == "IVB")] <- "British Virgin Islands"
df$Team[which(df$NOC == "JAM")] <- "Jamaica"
df$Team[which(df$NOC == "JOR")] <- "Jordan"
df$Team[which(df$NOC == "JPN")] <- "Japan"
df$Team[which(df$NOC == "KAZ")] <- "Kazakhstan"
df$Team[which(df$NOC == "KEN")] <- "Kenya"
df$Team[which(df$NOC == "KGZ")] <- "Kyrgyzstan"
df$Team[which(df$NOC == "KIR")] <- "Kiribati"
df$Team[which(df$NOC == "KOR")] <- "South Korea"
df$Team[which(df$NOC == "KOS")] <- "Kosovo"
df$Team[which(df$NOC == "KSA")] <- "Saudi Arabia"
df$Team[which(df$NOC == "LAO")] <- "Laos"
df$Team[which(df$NOC == "LAT")] <- "Latvia"
df$Team[which(df$NOC == "LBA")] <- "Libya"
df$Team[which(df$NOC == "LBR")] <- "Liberia"
df$Team[which(df$NOC == "LCA")] <- "Saint Lucia"
df$Team[which(df$NOC == "LES")] <- "Lesotho"
df$Team[which(df$NOC == "LIB")] <- "Lebanon"
df$Team[which(df$NOC == "LIE")] <- "Liechtenstein"
df$Team[which(df$NOC == "LTU")] <- "Lithuania"
df$Team[which(df$NOC == "LUX")] <- "Luxembourg"
df$Team[which(df$NOC == "MAD")] <- "Madagascar"
df$Team[which(df$NOC == "MAR")] <- "Morocco"
df$Team[which(df$NOC == "MAS")] <- "Malaysia"
df$Team[which(df$NOC == "MAW")] <- "Malawi"
df$Team[which(df$NOC == "MDA")] <- "Moldova"
df$Team[which(df$NOC == "MDV")] <- "Maldives"
df$Team[which(df$NOC == "MEX")] <- "Mexico"
df$Team[which(df$NOC == "MGL")] <- "Mongolia"
df$Team[which(df$NOC == "HML")] <- "Marshall Islands"
df$Team[which(df$NOC == "MKD")] <- "Macedonia"
df$Team[which(df$NOC == "MLI")] <- "Mali"
df$Team[which(df$NOC == "MLT")] <- "Malta"
df$Team[which(df$NOC == "MNE")] <- "Montenegro"
df$Team[which(df$NOC == "MON")] <- "Monaco"
df$Team[which(df$NOC == "MOZ")] <- "Mozambique"
df$Team[which(df$NOC == "MRI")] <- "Mauritius"
df$Team[which(df$NOC == "MTN")] <- "Mauritania"
df$Team[which(df$NOC == "MYA")] <- "Myanmar"
df$Team[which(df$NOC == "NAM")] <- "Namibia"
df$Team[which(df$NOC == "NCA")] <- "Nicaragua"
df$Team[which(df$NOC == "NED")] <- "Netherlands"
df$Team[which(df$NOC == "NEP")] <- "Nepal"
df$Team[which(df$NOC == "NGR")] <- "Nigeria"
df$Team[which(df$NOC == "NIG")] <- "Niger"
df$Team[which(df$NOC == "NOR")] <- "Norway"
df$Team[which(df$NOC == "NRU")] <- "Nauru"
df$Team[which(df$NOC == "NZL")] <- "New Zealand"
df$Team[which(df$NOC == "OMA")] <- "Oman"
df$Team[which(df$NOC == "PAK")] <- "Pakistan"
df$Team[which(df$NOC == "PAN")] <- "Panama"
df$Team[which(df$NOC == "PAR")] <- "Paraguay"
df$Team[which(df$NOC == "PER")] <- "Peru"
df$Team[which(df$NOC == "PHI")] <- "Philippines"
df$Team[which(df$NOC == "PLE")] <- "Palestine"
df$Team[which(df$NOC == "PLW")] <- "Palau"
df$Team[which(df$NOC == "PNG")] <- "Papua New Guinea"
df$Team[which(df$NOC == "POL")] <- "Poland"
df$Team[which(df$NOC == "POR")] <- "Portugal"
df$Team[which(df$NOC == "PRK")] <- "North Korea"
df$Team[which(df$NOC == "PUR")] <- "Puerto Rico"
df$Team[which(df$NOC == "QAT")] <- "Qatar"
df$Team[which(df$NOC == "ROU")] <- "Romania"
df$Team[which(df$NOC == "RSA")] <- "South Africa"
df$Team[which(df$NOC == "RUS")] <- "Russia"
df$Team[which(df$NOC == "URS")] <- "Russia"
df$NOC[which(df$NOC == "URS")] <- "RUS"
df$Team[which(df$NOC == "RWA")] <- "Rwanda"
df$Team[which(df$NOC == "SAM")] <- "Samoa"
df$Team[which(df$NOC == "SEN")] <- "Senegal"
df$Team[which(df$NOC == "SEY")] <- "Seychelles"
df$Team[which(df$NOC == "SGP")] <- "Singapore"
df$Team[which(df$NOC == "SKN")] <- "Saint Kitts and Nevis"
df$Team[which(df$NOC == "SLE")] <- "Sierra Leone"
df$Team[which(df$NOC == "SLO")] <- "Slovenia"
df$Team[which(df$NOC == "SMR")] <- "San Marino"
df$Team[which(df$NOC == "SOL")] <- "Solomon Islands"
df$Team[which(df$NOC == "SOM")] <- "Somalia"
df$Team[which(df$NOC == "SRB")] <- "Republic of Serbia"
df$Team[which(df$NOC == "SRI")] <- "Sri Lanka"
df$Team[which(df$NOC == "SSD")] <- "South Sudan"
df$Team[which(df$NOC == "STP")] <- "Sao Tome and Principe"
df$Team[which(df$NOC == "SUD")] <- "Sudan"
df$Team[which(df$NOC == "SUI")] <- "Switzerland"
df$Team[which(df$NOC == "SUR")] <- "Suriname"
df$Team[which(df$NOC == "SVK")] <- "Slovakia"
df$Team[which(df$NOC == "SWE")] <- "Sweden"
df$Team[which(df$NOC == "SWZ")] <- "Swaziland"
df$Team[which(df$NOC == "SYR")] <- "Syria"
df$Team[which(df$NOC == "TAN")] <- "United Republic of Tanzania"
df$Team[which(df$NOC == "TGA")] <- "Tonga"
df$Team[which(df$NOC == "THA")] <- "Thailand"
df$Team[which(df$NOC == "TJK")] <- "Tajikistan"
df$Team[which(df$NOC == "TKM")] <- "Turkmenistan"
df$Team[which(df$NOC == "TLS")] <- "East Timor"
df$Team[which(df$NOC == "TOG")] <- "Togo"
df$Team[which(df$NOC == "TPE")] <- "Chinese Taipei"
df$Team[which(df$NOC == "TTO")] <- "Trinidad and Tobago"
df$Team[which(df$NOC == "TUN")] <- "Tunisia"
df$Team[which(df$NOC == "TUR")] <- "Turkey"
df$Team[which(df$NOC == "TUV")] <- "Tuvalu"
df$Team[which(df$NOC == "UAE")] <- "United Arab Emirates"
df$Team[which(df$NOC == "UGA")] <- "Uganda"
df$Team[which(df$NOC == "UKR")] <- "Ukraine"
df$Team[which(df$NOC == "URU")] <- "Uruguay"
df$Team[which(df$NOC == "USA")] <- "United States of America"
df$Team[which(df$NOC == "UZB")] <- "Uzbekistan"
df$Team[which(df$NOC == "VAN")] <- "Vanuatu"
df$Team[which(df$NOC == "VEN")] <- "Venezuela"
df$Team[which(df$NOC == "VIE")] <- "Vietnam"
df$Team[which(df$NOC == "VIN")] <- "Saint Vincent and the Grenadines"
df$Team[which(df$NOC == "YEM")] <- "Yemen"
df$Team[which(df$NOC == "ZAM")] <- "Zambia"
df$Team[which(df$NOC == "ZIM")] <- "Zimbabwe"



##-----------------------------------------------------------------##

df$Code <- numeric(nrow(df))
View(df)
df$Code[which(df$NOC == "AFG")] <- 004
df$Code[which(df$NOC == "ALB")] <- 008
df$Code[which(df$NOC == "ALG")] <- 012
df$Code[which(df$NOC == "AND")] <- 020
df$Code[which(df$NOC == "ANG")] <- 024
df$Code[which(df$NOC == "ANT")] <- 028
df$Code[which(df$NOC == "ARG")] <- 032
df$Code[which(df$NOC == "ARM")] <- 051
df$Code[which(df$NOC == "ARU")] <- 533
df$Code[which(df$NOC == "ASA")] <- 016
df$Code[which(df$NOC == "AUS")] <- 036
df$Code[which(df$NOC == "AUT")] <- 040
df$Code[which(df$NOC == "AZE")] <- 031
df$Code[which(df$NOC == "BAH")] <- 044
df$Code[which(df$NOC == "BAN")] <- 050
df$Code[which(df$NOC == "BAR")] <- 052
df$Code[which(df$NOC == "BDI")] <- 108
df$Code[which(df$NOC == "BEL")] <- 056
df$Code[which(df$NOC == "BEN")] <- 204
df$Code[which(df$NOC == "BER")] <- 060
df$Code[which(df$NOC == "BHU")] <- 064
df$Code[which(df$NOC == "BIH")] <- 070
df$Code[which(df$NOC == "BIZ")] <- 084
df$Code[which(df$NOC == "BLR")] <- 112
df$Code[which(df$NOC == "BOL")] <- 068
df$Code[which(df$NOC == "BOT")] <- 072
df$Code[which(df$NOC == "BRA")] <- 076
df$Code[which(df$NOC == "BRN")] <- 048
df$Code[which(df$NOC == "BRU")] <- 096
df$Code[which(df$NOC == "BUL")] <- 100
df$Code[which(df$NOC == "BUR")] <- 854
df$Code[which(df$NOC == "CAF")] <- 140
df$Code[which(df$NOC == "CAM")] <- 116
df$Code[which(df$NOC == "CAN")] <- 124
df$Code[which(df$NOC == "CAY")] <- 136
df$Code[which(df$NOC == "CGO")] <- 178
df$Code[which(df$NOC == "CHA")] <- 148
df$Code[which(df$NOC == "CHI")] <- 152
df$Code[which(df$NOC == "CHN")] <- 156
df$Code[which(df$NOC == "CIV")] <- 384
df$Code[which(df$NOC == "CMR")] <- 120
df$Code[which(df$NOC == "COD")] <- 180
df$Code[which(df$NOC == "COK")] <- 184
df$Code[which(df$NOC == "COL")] <- 170
df$Code[which(df$NOC == "COM")] <- 174
df$Code[which(df$NOC == "CPV")] <- 132
df$Code[which(df$NOC == "CRC")] <- 188
df$Code[which(df$NOC == "CRO")] <- 191
df$Code[which(df$NOC == "CUB")] <- 192
df$Code[which(df$NOC == "CYP")] <- 196
df$Code[which(df$NOC == "CZE")] <- 203
df$Code[which(df$NOC == "DEN")] <- 208
df$Code[which(df$NOC == "DJI")] <- 262
df$Code[which(df$NOC == "DMA")] <- 212
df$Code[which(df$NOC == "DOM")] <- 214
df$Code[which(df$NOC == "ECU")] <- 218
df$Code[which(df$NOC == "EGY")] <- 818
df$Code[which(df$NOC == "ERI")] <- 232
df$Code[which(df$NOC == "ESA")] <- 222
df$Code[which(df$NOC == "ESP")] <- 724
df$Code[which(df$NOC == "EST")] <- 233
df$Code[which(df$NOC == "ETH")] <- 231
df$Code[which(df$NOC == "FIJ")] <- 242
df$Code[which(df$NOC == "FIN")] <- 246
df$Code[which(df$NOC == "FRA")] <- 250
df$Code[which(df$NOC == "FSM")] <- 583
df$Code[which(df$NOC == "GAB")] <- 266
df$Code[which(df$NOC == "GAM")] <- 270
df$Code[which(df$NOC == "GBR")] <- 235
df$Code[which(df$NOC == "GBS")] <- 624
df$Code[which(df$NOC == "GEO")] <- 268
df$Code[which(df$NOC == "GEQ")] <- 226
df$Code[which(df$NOC == "GER")] <- 276
df$Code[which(df$NOC == "GHA")] <- 288
df$Code[which(df$NOC == "GRE")] <- 300
df$Code[which(df$NOC == "GRN")] <- 308
df$Code[which(df$NOC == "GUA")] <- 320
df$Code[which(df$NOC == "GUI")] <- 324
df$Code[which(df$NOC == "GUM")] <- 316
df$Code[which(df$NOC == "GUY")] <- 328
df$Code[which(df$NOC == "HAI")] <- 322
df$Code[which(df$NOC == "HKG")] <- 344
df$Code[which(df$NOC == "HON")] <- 340
df$Code[which(df$NOC == "HUN")] <- 348
df$Code[which(df$NOC == "INA")] <- 360
df$Code[which(df$NOC == "IND")] <- 356
df$Code[which(df$NOC == "IRI")] <- 364
df$Code[which(df$NOC == "IRL")] <- 372
df$Code[which(df$NOC == "IRQ")] <- 368
df$Code[which(df$NOC == "ISL")] <- 352
df$Code[which(df$NOC == "ISR")] <- 376
df$Code[which(df$NOC == "ISV")] <- 850
df$Code[which(df$NOC == "ITA")] <- 380
df$Code[which(df$NOC == "IVB")] <- 092
df$Code[which(df$NOC == "JAM")] <- 388
df$Code[which(df$NOC == "JOR")] <- 400
df$Code[which(df$NOC == "JPN")] <- 392
df$Code[which(df$NOC == "KAZ")] <- 398
df$Code[which(df$NOC == "KEN")] <- 404
df$Code[which(df$NOC == "KGZ")] <- 417
df$Code[which(df$NOC == "KIR")] <- 296
df$Code[which(df$NOC == "KOR")] <- 410
#df$Code[which(df$NOC == "KOS")] <- "Kosovo"
df$Code[which(df$NOC == "KSA")] <- 682
df$Code[which(df$NOC == "LAO")] <- 418
df$Code[which(df$NOC == "LAT")] <- 428
df$Code[which(df$NOC == "LBA")] <- 434
df$Code[which(df$NOC == "LBR")] <- 430
df$Code[which(df$NOC == "LCA")] <- 662
df$Code[which(df$NOC == "LES")] <- 426
df$Code[which(df$NOC == "LIB")] <- 422
df$Code[which(df$NOC == "LIE")] <- 438
df$Code[which(df$NOC == "LTU")] <- 440
df$Code[which(df$NOC == "LUX")] <- 442
df$Code[which(df$NOC == "MAD")] <- 450
df$Code[which(df$NOC == "MAR")] <- 504
df$Code[which(df$NOC == "MAS")] <- 458
df$Code[which(df$NOC == "MAW")] <- 454
df$Code[which(df$NOC == "MDA")] <- 498
df$Code[which(df$NOC == "MDV")] <- 462
df$Code[which(df$NOC == "MEX")] <- 484
df$Code[which(df$NOC == "MGL")] <- 496
df$Code[which(df$NOC == "HML")] <- 584
df$Code[which(df$NOC == "MKD")] <- 807
df$Code[which(df$NOC == "MLI")] <- 466
df$Code[which(df$NOC == "MLT")] <- 470
df$Code[which(df$NOC == "MNE")] <- 499
df$Code[which(df$NOC == "MON")] <- 492
df$Code[which(df$NOC == "MOZ")] <- 508
df$Code[which(df$NOC == "MRI")] <- 480
df$Code[which(df$NOC == "MTN")] <- 478
df$Code[which(df$NOC == "MYA")] <- 104
df$Code[which(df$NOC == "NAM")] <- 516
df$Code[which(df$NOC == "NCA")] <- 558
df$Code[which(df$NOC == "NED")] <- 528
df$Code[which(df$NOC == "NEP")] <- 524
df$Code[which(df$NOC == "NGR")] <- 566
df$Code[which(df$NOC == "NIG")] <- 562
df$Code[which(df$NOC == "NOR")] <- 578
df$Code[which(df$NOC == "NRU")] <- 520
df$Code[which(df$NOC == "NZL")] <- 554
df$Code[which(df$NOC == "OMA")] <- 512
df$Code[which(df$NOC == "PAK")] <- 586
df$Code[which(df$NOC == "PAN")] <- 591
df$Code[which(df$NOC == "PAR")] <- 600
df$Code[which(df$NOC == "PER")] <- 604
df$Code[which(df$NOC == "PHI")] <- 608
df$Code[which(df$NOC == "PLE")] <- 275
df$Code[which(df$NOC == "PLW")] <- 585
df$Code[which(df$NOC == "PNG")] <- 598
df$Code[which(df$NOC == "POL")] <- 616
df$Code[which(df$NOC == "POR")] <- 620
df$Code[which(df$NOC == "PRK")] <- 408
df$Code[which(df$NOC == "PUR")] <- 630
df$Code[which(df$NOC == "QAT")] <- 634
df$Code[which(df$NOC == "ROU")] <- 642
df$Code[which(df$NOC == "RSA")] <- 710
df$Code[which(df$NOC == "RUS")] <- 643
df$Code[which(df$NOC == "RWA")] <- 646
df$Code[which(df$NOC == "SAM")] <- 016
df$Code[which(df$NOC == "SEN")] <- 686
df$Code[which(df$NOC == "SEY")] <- 690
df$Code[which(df$NOC == "SGP")] <- 702
df$Code[which(df$NOC == "SKN")] <- 659
df$Code[which(df$NOC == "SLE")] <- 694
df$Code[which(df$NOC == "SLO")] <- 705
df$Code[which(df$NOC == "SMR")] <- 674
df$Code[which(df$NOC == "SOL")] <- 090
df$Code[which(df$NOC == "SOM")] <- 706
df$Code[which(df$NOC == "SRB")] <- 688
df$Code[which(df$NOC == "SRI")] <- 144
df$Code[which(df$NOC == "SSD")] <- 728
df$Code[which(df$NOC == "STP")] <- 678
df$Code[which(df$NOC == "SUD")] <- 729
df$Code[which(df$NOC == "SUI")] <- 756
df$Code[which(df$NOC == "SUR")] <- 740
df$Code[which(df$NOC == "SVK")] <- 703
df$Code[which(df$NOC == "SWE")] <- 752
df$Code[which(df$NOC == "SWZ")] <- 748
df$Code[which(df$NOC == "SYR")] <- 760
df$Code[which(df$NOC == "TAN")] <- 834
df$Code[which(df$NOC == "TGA")] <- 776
df$Code[which(df$NOC == "THA")] <- 764
df$Code[which(df$NOC == "TJK")] <- 762
df$Code[which(df$NOC == "TKM")] <- 795
df$Code[which(df$NOC == "TLS")] <- 626
df$Code[which(df$NOC == "TOG")] <- 768
#df$Code[which(df$NOC == "TPE")] <- "Chinese Taipei"
df$Code[which(df$NOC == "TTO")] <- 780
df$Code[which(df$NOC == "TUN")] <- 788
df$Code[which(df$NOC == "TUR")] <- 792
df$Code[which(df$NOC == "TUV")] <- 798
df$Code[which(df$NOC == "UAE")] <- 784
df$Code[which(df$NOC == "UGA")] <- 800
df$Code[which(df$NOC == "UKR")] <- 804
df$Code[which(df$NOC == "URU")] <- 858
df$Code[which(df$NOC == "USA")] <- 840
df$Code[which(df$NOC == "UZB")] <- 860
df$Code[which(df$NOC == "VAN")] <- 548
df$Code[which(df$NOC == "VEN")] <- 862
df$Code[which(df$NOC == "VIE")] <- 704
df$Code[which(df$NOC == "VIN")] <- 670
df$Code[which(df$NOC == "YEM")] <- 887
df$Code[which(df$NOC == "ZAM")] <- 894
df$Code[which(df$NOC == "ZIM")] <- 716
