using MySql.Data.MySqlClient;
using Serilog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Data;

namespace LibraryManagementAPI.Controllers
{
    [System.Web.Http.RoutePrefix("api/student")]
    public class StudentController : System.Web.Http.ApiController
    {
        //GET the Book table data
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("books")]
        // GET api/values
        public IEnumerable<booksdata> GetBooks()
        {
            //create List to store the table data
            List<booksdata> bdata = new List<booksdata>();
            //Connection Establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            booksdata b_data = null;

            try
            {
                //connection open
                con.Open();

                //query creation
                string query = "SELECT ID_B, book_name, author, publisher, book_count, cost_per_book, total_cost FROM books";
                MySqlCommand cmd = new MySqlCommand(query, con);
                MySqlDataReader reader = cmd.ExecuteReader();

                //read the data from the reader
                while (reader.Read())
                {
                    b_data = new booksdata
                    {
                        ID_B = reader["ID_B"].ToString(),
                        book_name = reader["book_name"].ToString(),
                        author = reader["author"].ToString(),
                        publisher = reader["publisher"].ToString(),
                        book_count = reader["book_count"].ToString(),
                        cost_per_book = reader["cost_per_book"].ToString(),
                        total_cost = reader["total_cost"].ToString(),
                    };
                    bdata.Add(b_data);
                }
                reader.Close();
            }
            catch (Exception ex)
            {
                // Log the exception using Serilog
                Log.Error(ex, "An error occurred while fetching books data");

                // Return a meaningful error response to the client
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
            finally
            {
                con.Close();
            }
            return bdata;
        }


        // PUT endpoint for updating a book
        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("updateBook/{ID_B}")]
        public IHttpActionResult UpdateBook(string ID_B, [FromBody] booksdata student)
        {
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            try
            {
                // Validate input
                int bookcount = Convert.ToInt32(student.book_count);
                double costperbook = Convert.ToDouble(student.cost_per_book);

                if (bookcount <= 0 || costperbook <= 0)
                {
                    return BadRequest("Book count and cost per book must be greater than zero.");
                }

                // Calculate the total cost
                double totalcost = bookcount * costperbook;

                con.Open();
                string query = "UPDATE books SET ID_B = @ID_B, book_name = @book_name, author = @author, " +
                               "publisher = @publisher, book_count = @book_count, cost_per_book = @cost_per_book, total_cost = @total_cost " +
                               "WHERE ID_B = @ID_B";
                MySqlCommand cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@ID_B", ID_B);
                cmd.Parameters.AddWithValue("@book_name", student.book_name);
                cmd.Parameters.AddWithValue("@author", student.author);
                cmd.Parameters.AddWithValue("@publisher", student.publisher);
                cmd.Parameters.AddWithValue("@book_count", student.book_count);
                cmd.Parameters.AddWithValue("@cost_per_book", student.cost_per_book);
                cmd.Parameters.AddWithValue("@total_cost", totalcost);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occurred while updating book data");
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
            finally
            {
                con.Close();
            }
            return Ok();
        }


        // DELETE endpoint for deleting a book
        [System.Web.Http.HttpDelete]
        [System.Web.Http.Route("deleteBook/{ID_B}")]
        public IHttpActionResult DeleteBook(string ID_B)
        {
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            try
            {
                con.Open();

                // Log the received ID_B value
                Log.Information($"Received ID_B: {ID_B}");

                //check if book has been issued or not
                string I_book = "Select count(*) from book_issue where ID_B = @ID_B";
                MySqlCommand I_bookcmd = new MySqlCommand(I_book, con);
                I_bookcmd.Parameters.AddWithValue("@ID_B", ID_B.Trim());

                // Log the command text and parameters
                Log.Information($"Executing SQL: {I_bookcmd.CommandText}");
                foreach (MySqlParameter param in I_bookcmd.Parameters)
                {
                    Log.Information($"Parameter: {param.ParameterName} = {param.Value}");
                }


                int I_bookCount = Convert.ToInt32(I_bookcmd.ExecuteScalar());

                // Log the result
                Log.Information($"Issued book count: {I_bookCount}");


                if (I_bookCount > 0)
                {
                    return (IHttpActionResult)Request.CreateResponse(System.Net.HttpStatusCode.BadRequest, "Failed to delete. Book has issued.");
                }
                else
                {
                    string query = "DELETE FROM books WHERE ID_B = @ID_B";
                    MySqlCommand cmd = new MySqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@ID_B", ID_B);
                    cmd.ExecuteNonQuery();
                }

            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occurred while deleting book data");
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
            finally
            {
                con.Close();
            }
            return Ok();
        }



        //new post method for login - user login
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("login")]
        public HttpResponseMessage Login_User([FromBody] Login loginData)
        {
            // Connection Establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);

            try
            {
                con.Open();

                // Modified query to fetch USN and password
                string query = "SELECT USN, password FROM user_data WHERE email = @email";
                MySqlCommand cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@email", loginData.email);
                var reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    string storepswd = reader["password"].ToString();
                    string usn = reader["USN"].ToString(); // Get the USN

                    if (storepswd == loginData.password)
                    {
                        var response = new
                        {
                            //session variable name = table's column name
                            USN = usn,
                            Email = loginData.email
                        };
                        return Request.CreateResponse(System.Net.HttpStatusCode.OK, response);
                    }
                    else
                    {
                        return Request.CreateResponse(System.Net.HttpStatusCode.OK, "Invalid Email or Password");
                    }
                }
                else
                {
                    return Request.CreateResponse(System.Net.HttpStatusCode.OK, "Register before login");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(System.Net.HttpStatusCode.InternalServerError, $"An error occurred: {ex.Message}");
            }
            finally
            {
                con.Close();
            }
        }


        //new post method for login - Admin login
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("loginAdmin")]
        public HttpResponseMessage Login_admin([FromBody] Login_Admin login_a)
        {
            //Connection Establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);

            try
            {
                con.Open();

                string query = "SELECT pswd FROM admin WHERE email = @email";
                MySqlCommand cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@email", login_a.email);
                var reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    string storepswd = reader["pswd"].ToString();

                    if (storepswd == login_a.pswd)
                    {
                        return Request.CreateResponse(System.Net.HttpStatusCode.OK, "Admin Login Successful");
                    }
                    else
                    {
                        return Request.CreateResponse(System.Net.HttpStatusCode.OK, "Invalid Admin Email or Password");
                    }
                }
                else
                {
                    return Request.CreateResponse(System.Net.HttpStatusCode.OK, "Invalid Admin Email or Password");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(System.Net.HttpStatusCode.InternalServerError, $"An error occurred: {ex.Message}");
            }
            finally
            {
                con.Close();
            }

        }

        //new post method for user_data table - insert into registration table
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("register")]
        // POST api/values

        /*(String firstname, String lastname, String age, String gender, String usn, String course,String branch, String email, String phoneno, String password, String conf_pswd)*/
        public HttpResponseMessage Register_post([FromBody] docdataclass docdata)
        {
            //Connection Establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);

            try
            {
                //Connection open
                con.Open();

                //Query creation
                string query = "Insert Into user_data (firstname, lastname, age, gender, usn, course, branch, email, phoneno, password)" +
                                "Values (@firstname, @lastname, @age, @gender, @usn, @course, @branch, @email, @phoneno, @password)";

                //Query Execution - command creation
                MySqlCommand cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@firstname", docdata.firstname);
                cmd.Parameters.AddWithValue("@lastname", docdata.lastname);
                cmd.Parameters.AddWithValue("@age", docdata.age);
                cmd.Parameters.AddWithValue("@gender", docdata.gender);
                cmd.Parameters.AddWithValue("@usn", docdata.usn);
                cmd.Parameters.AddWithValue("@course", docdata.course);
                cmd.Parameters.AddWithValue("@branch", docdata.branch);
                cmd.Parameters.AddWithValue("@email", docdata.email);
                cmd.Parameters.AddWithValue("@phoneno", docdata.phoneno);
                cmd.Parameters.AddWithValue("@password", docdata.password);
                int statuscode = cmd.ExecuteNonQuery();

                if (statuscode > 0)
                {
                    return Request.CreateResponse(System.Net.HttpStatusCode.OK, "Data Inserted Succesfully");
                }
                else
                {
                    return Request.CreateResponse(System.Net.HttpStatusCode.BadRequest, "Data Insertion failed");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(System.Net.HttpStatusCode.InternalServerError, ex.Message);
            }
            finally
            {
                //close connection
                con.Close();
            }
        }


        // GET api for Dashbord data
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("DashboardData")]
        public IHttpActionResult GetDashboardData()
        {
            //connection establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);

            DashboardData dashboardData = new DashboardData();

            try
            {
                //connection open
                con.Open();

                //Get student count from user_data table
                dashboardData.studentCount = GetCount(con, "SELECT COUNT(*) FROM user_data");

                //Get book count from book_issue table
                dashboardData.bookCount = GetCount(con, "SELECT COUNT(*) FROM books");

                //Get pending return count from book_issue table where return status is not returned
                dashboardData.pendingReturnCount = GetCount(con, "SELECT CouNT(*) FROM book_issue WHERE return_status != 'returned'");

                //Get borrowed book data - query creation
                string borrowedBooksQuery = @"SELECT issue_date AS BorrowedDate, COUNT(*) AS COUNT FROM book_issue GROUP BY issue_date ORDER BY BorrowedDate";

                var borrowedBooksData = new borrowedBooksData();
                var labels = new List<string>();
                var values = new List<int>();

                MySqlCommand cmd = new MySqlCommand(borrowedBooksQuery, con);
                MySqlDataReader reader = cmd.ExecuteReader();

                //read the data
                while (reader.Read())
                {
                    labels.Add(reader.GetDateTime("BorrowedDate").ToShortDateString());
                    values.Add(reader.GetInt32("COUNT"));
                }

                borrowedBooksData.Labels = labels.ToArray();
                borrowedBooksData.Values = values.ToArray();

                //dashboard data for borrowed books
                dashboardData.borrowedBooksData = borrowedBooksData;

            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occured while fetching student data");
                return InternalServerError(ex);
            }
            finally
            {
                con.Close();
            }
            return Ok(dashboardData);
        }


        // Define the total number of books a student can borrow
        private const int TotalBooksLimit = 3;

        // GET api/student/dashboard/{usn}
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("studentboard/{usn}")]
        public IHttpActionResult GetStudentBoard(string usn)
        {
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            try
            {
                con.Open();

                // Get total number of books a student can borrow (constant)
                int totalBooks = TotalBooksLimit;

                // Get count of books borrowed by the student
                string borrowedBooksQuery = "SELECT COUNT(*) FROM book_issue WHERE USN = @usn";
                MySqlCommand borrowedBooksCmd = new MySqlCommand(borrowedBooksQuery, con);
                borrowedBooksCmd.Parameters.AddWithValue("@usn", usn);
                int borrowedBooksCount = Convert.ToInt32(borrowedBooksCmd.ExecuteScalar());

                string booksToBeRetrnedBooksQuery = "SELECT COUNT(*) FROM book_issue WHERE USN = @usn AND return_date IS NULL";
                MySqlCommand booksToBeReturnedBooksCmd = new MySqlCommand(booksToBeRetrnedBooksQuery, con);
                booksToBeReturnedBooksCmd.Parameters.AddWithValue("@usn", usn);
                int booksToBeReturnedCount = Convert.ToInt32(booksToBeReturnedBooksCmd.ExecuteScalar());


                // Calculate number of books to be returned
                /*int booksToBeReturnedCount = Math.Max(0, borrowedBooksCount - totalBooks);*/

                // Prepare data to return
                var dashboardData = new
                {
                    TotalBooks = totalBooks,
                    BorrowedBooksCount = borrowedBooksCount,
                    BooksToBeReturnedCount = booksToBeReturnedCount
                };

                return Ok(dashboardData);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occurred while fetching student dashboard data");
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
            finally
            {
                con.Close();
            }
        }


        // GET for Student data 
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("studentData")]
        public IEnumerable<docdataclass> Getdocdataclass()
        {
            //create List to store the table data
            List<docdataclass> stdData_l = new List<docdataclass>();
            //connection establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            docdataclass stdData = null;

            try
            {
                //open connection
                con.Open();
                //query creation
                string query = "Select firstname,lastname,age,gender,usn,course,branch,email,phoneno from user_data";
                //command execution
                MySqlCommand cmd = new MySqlCommand(query, con);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    stdData = new docdataclass
                    {
                        firstname = reader["firstname"].ToString(),
                        lastname = reader["lastname"].ToString(),
                        age = reader["age"].ToString(),
                        gender = reader["gender"].ToString(),
                        usn = reader["usn"].ToString(),
                        course = reader["course"].ToString(),
                        branch = reader["branch"].ToString(),
                        email = reader["email"].ToString(),
                        phoneno = reader["phoneno"].ToString()
                    };
                    stdData_l.Add(stdData);
                }
                reader.Close();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occured while fetching student data");
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
            finally
            {
                con.Close();
            }
            return stdData_l;
        }


        // DELETE endpoint for deleting a student
        [System.Web.Http.HttpDelete]
        [System.Web.Http.Route("deleteStudent/{usn}")]
        public IHttpActionResult DeleteStudent(string usn)
        {
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            try
            {
                con.Open();
                // Log the received usn value
                Log.Information($"Received usn: {usn}");

                //check if the student has borrowed books
                string borrowedBooks = "SELECT COUNT(*) from book_issue where usn = @usn";
                MySqlCommand borrowedBooks_cmd = new MySqlCommand(borrowedBooks, con);
                borrowedBooks_cmd.Parameters.AddWithValue("@usn", usn);

                // Log the command text and parameters
                Log.Information($"Executing SQL: {borrowedBooks_cmd.CommandText}");
                foreach (MySqlParameter param in borrowedBooks_cmd.Parameters)
                {
                    Log.Information($"Parameter: {param.ParameterName} = {param.Value}");
                }

                int borrowedBooks_count = Convert.ToInt32(borrowedBooks_cmd.ExecuteScalar());

                // Log the result
                Log.Information($"Borrowed books count: {borrowedBooks_count}");

                if (borrowedBooks_count > 0)
                {
                    var responseMessage = Request.CreateResponse(System.Net.HttpStatusCode.BadRequest, "Failed to delete. Student has borrowed the books.");
                    throw new HttpResponseException(responseMessage);
                }
                else
                {
                    string query = "DELETE FROM user_data WHERE usn = @usn";
                    MySqlCommand cmd = new MySqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@usn", usn);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occurred while deleting student data");
                var responseMessage = Request.CreateResponse(HttpStatusCode.InternalServerError, "An error occurred while deleteing the data.");
                throw new HttpResponseException(responseMessage);
            }
            finally
            {
                con.Close();
            }
            return Ok();
        }

        // PUT endpoint for updating a student
        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("updateStudent/{usn}")]
        public IHttpActionResult UpdateStudent(string usn, [FromBody] docdataclass student)
        {
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            try
            {
                con.Open();
                string query = "UPDATE user_data SET firstname = @firstname, lastname = @lastname, age = @age, " +
                               "gender = @gender, course = @course, branch = @branch, email = @mailto, phoneno = @phoneno " +
                               "WHERE usn = @usn";
                MySqlCommand cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@usn", usn);
                cmd.Parameters.AddWithValue("@firstname", student.firstname);
                cmd.Parameters.AddWithValue("@lastname", student.lastname);
                cmd.Parameters.AddWithValue("@age", student.age);
                cmd.Parameters.AddWithValue("@gender", student.gender);
                cmd.Parameters.AddWithValue("@course", student.course);
                cmd.Parameters.AddWithValue("@branch", student.branch);
                cmd.Parameters.AddWithValue("@mailto", student.email);
                cmd.Parameters.AddWithValue("@phoneno", student.phoneno);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occurred while updating student data");
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
            finally
            {
                con.Close();
            }
            return Ok();
        }


        // GET book details for manage book component
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("booksData")]
        public IEnumerable<booksdata> Getbooksdata()
        {
            //create List to store the table data
            List<booksdata> b_data = new List<booksdata>();
            //connection establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            booksdata b_Data = null;

            try
            {
                //open connection
                con.Open();
                //query creation
                string query = "Select * from books";
                //command execution
                MySqlCommand cmd = new MySqlCommand(query, con);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    b_Data = new booksdata
                    {
                        ID_B = reader["ID_B"].ToString(),
                        book_name = reader["book_name"].ToString(),
                        author = reader["author"].ToString(),
                        publisher = reader["publisher"].ToString(),
                        book_count = reader["book_count"].ToString(),
                        cost_per_book = reader["cost_per_book"].ToString(),
                        total_cost = reader["total_cost"].ToString()
                    };
                    b_data.Add(b_Data);
                }
                reader.Close();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occured while fetching student data");
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
            finally
            {
                con.Close();
            }
            return b_data;
        }


        //new post method for books table - insert into books
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("books")]
        public HttpResponseMessage Books_post([FromBody] booksdata book_data)
        {
            // Connection establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);

            try
            {
                // Open connection
                con.Open();

                // Check if the book already exists with the same name but different author or publisher
                string checkQuery = "SELECT COUNT(*) FROM books WHERE book_name = @book_name AND (author != @author OR publisher != @publisher)";
                MySqlCommand checkCmd = new MySqlCommand(checkQuery, con);
                checkCmd.Parameters.AddWithValue("@book_name", book_data.book_name);
                checkCmd.Parameters.AddWithValue("@author", book_data.author);
                checkCmd.Parameters.AddWithValue("@publisher", book_data.publisher);

                int existingCount = Convert.ToInt32(checkCmd.ExecuteScalar());

                if (existingCount > 0)
                {
                    // Book with the same name exists with different author or publisher
                    string insertQuery = "INSERT INTO books (ID_B, book_name, author, publisher, book_count, cost_per_book, total_cost)" +
                                         "VALUES (@ID_B, @book_name, @author, @publisher, @book_count, @cost_per_book, @total_cost)";
                    MySqlCommand insertCmd = new MySqlCommand(insertQuery, con);
                    insertCmd.Parameters.AddWithValue("@ID_B", book_data.ID_B);
                    insertCmd.Parameters.AddWithValue("@book_name", book_data.book_name);
                    insertCmd.Parameters.AddWithValue("@author", book_data.author);
                    insertCmd.Parameters.AddWithValue("@publisher", book_data.publisher);
                    insertCmd.Parameters.AddWithValue("@book_count", book_data.book_count);
                    insertCmd.Parameters.AddWithValue("@cost_per_book", book_data.cost_per_book);
                    insertCmd.Parameters.AddWithValue("@total_cost", book_data.total_cost);

                    int statuscode = insertCmd.ExecuteNonQuery();

                    if (statuscode > 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.OK, "Data Inserted Successfully");
                    }
                    else
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "Data Insertion failed");
                    }
                }
                else
                {
                    // Book with the same name exists with the same author and publisher
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Book with the same name and same author/publisher already exists");
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Error inserting data: " + ex.Message);
            }
            finally
            {
                con.Close();
            }
        }



        //new get method for book_issue table 
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("book_issue")]
        // GET api/values
        public IEnumerable<Book_issue> GetBookIssue()
        {
            //create List to store the table data
            List<Book_issue> bidata = new List<Book_issue>();
            //Connection Establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            Book_issue bdata_issue = null;

            try
            {
                //connection open
                con.Open();

                //query creation
                string query = "SELECT ID_B, book_name, author, publisher,USN,DATE_FORMAT(issue_date, '%Y-%m-%d') as issue_date,DATE_FORMAT(due_date, '%Y-%m-%d') as due_date FROM book_issue ORDER BY issue_date ASC"; //DESC
                MySqlCommand cmd = new MySqlCommand(query, con);
                MySqlDataReader reader = cmd.ExecuteReader();

                //read the data from the reader
                while (reader.Read())
                {
                    bdata_issue = new Book_issue
                    {
                        ID_B = reader["ID_B"].ToString(),
                        book_name = reader["book_name"].ToString(),
                        author = reader["author"].ToString(),
                        publisher = reader["publisher"].ToString(),
                        USN = reader["USN"].ToString(),
                        issue_date = reader["issue_date"].ToString(),
                        due_date = reader["due_date"].ToString()
                    };
                    bidata.Add(bdata_issue);
                }
                reader.Close();
            }
            catch (Exception ex)
            {
                // Log the exception using Serilog
                Log.Error(ex, "An error occurred while fetching books data");

                // Return a meaningful error response to the client
                /*throw new HttpResponseException(HttpStatusCode.InternalServerError);*/
            }
            finally
            {
                con.Close();
            }
            return bidata;

        }

        //Post method for book_issue for Borrow_Book page
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("BorrowBooks")]
        public IHttpActionResult BorrowBooks([FromBody] Book_issue bookIssue)
        {
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            try
            {
                con.Open();

                // Check if the student has already borrowed this book and if the student can borrow more books
                string checkQuery = "SELECT COUNT(*) FROM book_issue WHERE ID_B = @ID_B AND USN = @USN AND return_date IS NULL";
                MySqlCommand checkCmd = new MySqlCommand(checkQuery, con);
                checkCmd.Parameters.AddWithValue("@ID_B", bookIssue.ID_B);
                checkCmd.Parameters.AddWithValue("@USN", bookIssue.USN);
                int count = Convert.ToInt32(checkCmd.ExecuteScalar());


                //check if student exceeds the borrow book limit
                string countBooksQuery = "SELECT COUNT(*) FROM book_issue WHERE USN = @USN AND return_date IS NULL";
                MySqlCommand countBooksCmd = new MySqlCommand(countBooksQuery, con);
                countBooksCmd.Parameters.AddWithValue("@USN", bookIssue.USN);
                int totalBorrowedBooks = Convert.ToInt32(countBooksCmd.ExecuteScalar());


                //check either of the condition is true , if so then return bad request status code
                if (count > 0 || totalBorrowedBooks >= 3)
                {
                    // Update fines for all students who have borrowed books
                    UpdateFines(con);
                    /*return BadRequest("The student has already borrowed this book. OR The student has already borrowed the maximum number of books (3).");*/
                    return Content(HttpStatusCode.BadRequest, "The student has already borrowed this book or has already borrowed the maximum number of books (3).");
                }
                else
                {
                    // Insert new book issue record
                    //ID_B,book_name,author,publisher,USN,std_borrow_count,issue_date,due_date,return_status,return_date,fine
                    string insertQuery = @"INSERT INTO book_issue (ID_B, book_name, author, publisher, USN, std_borrow_count, issue_date, due_date,return_status, fine)
                                    VALUES (@ID_B, @book_name, @author, @publisher, @USN, @std_borrow_count, @issue_date, @due_date, @return_status, @fine)";
                    MySqlCommand insertCmd = new MySqlCommand(insertQuery, con);
                    insertCmd.Parameters.AddWithValue("@ID_B", bookIssue.ID_B);
                    insertCmd.Parameters.AddWithValue("@book_name", bookIssue.book_name);
                    insertCmd.Parameters.AddWithValue("@author", bookIssue.author);
                    insertCmd.Parameters.AddWithValue("@publisher", bookIssue.publisher);
                    insertCmd.Parameters.AddWithValue("@USN", bookIssue.USN);
                    insertCmd.Parameters.AddWithValue("@std_borrow_count", totalBorrowedBooks + 1);
                    insertCmd.Parameters.AddWithValue("@issue_date", DateTime.Now);
                    insertCmd.Parameters.AddWithValue("@due_date", DateTime.Now.AddDays(15));
                    insertCmd.Parameters.AddWithValue("@return_status", "Not Returned");
                    insertCmd.Parameters.AddWithValue("@fine", 0);
                    insertCmd.ExecuteNonQuery();

                    // Update fines for all students who have borrowed books
                    UpdateFines(con);
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occurred while borrowing book");
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
            finally
            {
                con.Close();
            }
            return Ok(new { message = "Book Borrowed Successfully."});
        }

        //methos to update the fine column
        private void UpdateFines(MySqlConnection con)
        {
            string updateFineQuery = @"UPDATE book_issue SET fine = CASE WHEN due_date < NOW() THEN DATEDIFF(NOW(), due_date) * 20 ELSE 0 END WHERE return_date IS NULL";
            MySqlCommand updateFineCmd = new MySqlCommand(updateFineQuery, con);
            updateFineCmd.ExecuteNonQuery();
        }


        //new get method for my borrows component - fetched from book_issue table 
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("borrowedBooks/{usn}")]
        // GET api/values
        public IHttpActionResult BorrowedBooks(string usn)
        {
            //connection establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);

            try
            {
                con.Open();

                //query to fetch borrowed books based on USN
                string query = @"SELECT ID_B, book_name, author, publisher, USN, DATE_FORMAT(issue_date, '%Y-%m-%d') as issue_date, DATE_FORMAT(due_date, '%Y-%m-%d') as due_date, return_status FROM book_issue WHERE USN = @usn ORDER BY return_status ASC";      //sort to display not returned first
                MySqlCommand cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@USN", usn);

                List<Book_issue> borrowedBooks = new List<Book_issue>();
                var reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    borrowedBooks.Add(new Book_issue
                    {
                        ID_B = reader["ID_B"].ToString(),
                        book_name = reader["book_name"].ToString(),
                        author = reader["author"].ToString(),
                        publisher = reader["publisher"].ToString(),
                        USN = reader["USN"].ToString(),
                        issue_date = reader["issue_date"].ToString(),
                        due_date = reader["due_date"].ToString(),
                        return_status = reader["return_status"].ToString()
                    });
                }
                return Ok(borrowedBooks);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occured while fetching borrowed books");
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
            finally
            {
                con.Close();
            }
        }

        // GET return Book data from Book_issue table
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("returnBook")]
        public IEnumerable<Book_issue> GetBook_issue_()
        {
            //create List to store the table data
            List<Book_issue> b_issue = new List<Book_issue>();
            //connection establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            Book_issue B_Issue = null;

            try
            {
                //open connection
                con.Open();
                //update the fine in book issue table
                UpdateFines(con);

                //query creation
                string query = "SELECT ID_B, book_name, USN, DATE_FORMAT(issue_date, '%Y-%m-%d') as issue_date, DATE_FORMAT(due_date, '%Y-%m-%d') as due_date, fine FROM book_issue WHERE return_status = 'Not Returned' ORDER BY issue_date ASC";     //DESC
                //command execution
                MySqlCommand cmd = new MySqlCommand(query, con);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    B_Issue = new Book_issue
                    {
                        ID_B = reader["ID_B"].ToString(),
                        book_name = reader["book_name"].ToString(),
                        USN = reader["USN"].ToString(),
                        issue_date = reader["issue_date"].ToString(),
                        due_date = reader["due_date"].ToString(),
                        fine = reader["fine"].ToString(),
                        return_date = string.Empty                       //since its not returned yet
                    };
                    b_issue.Add(B_Issue);
                }
                reader.Close();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occured while fetching student data");
                /*return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);*/
            }
            finally
            {
                con.Close();
            }
            return b_issue;
        }

        //Reurn date updates using ID_B in book_issue table
        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("returnBook/{id}")]
        public IHttpActionResult ReturnBook(string id)
        {
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            try
            {
                con.Open();
                string query = "UPDATE book_issue SET return_date = @return_date, return_status = 'Returned' WHERE ID_B = @id";
                MySqlCommand cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@return_date", DateTime.Now.ToString("yyyy-MM-dd"));
                cmd.Parameters.AddWithValue("@id", id);

                int result = cmd.ExecuteNonQuery();
                if (result > 0)
                {
                    return Ok("Return date updated successfully");
                }
                else
                {
                    return BadRequest("Failed to update return date");
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occurred while updating return date");
                return InternalServerError();
            }
            finally
            {
                con.Close();
            }
        }


        // GET return tracker data from Book_issue table
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("returnTracker")]
        public IEnumerable<Book_issue> GetBook_issue_tracker()
        {
            //create List to store the table data
            List<Book_issue> b_tracker = new List<Book_issue>();
            //connection establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            Book_issue B_Tracker = null;

            try
            {
                //open connection
                con.Open();
                //query creation
                string query = "SELECT ID_B, book_name, USN, DATE_FORMAT(issue_date, '%Y-%m-%d') as issue_date, DATE_FORMAT(due_date, '%Y-%m-%d') as due_date FROM book_issue WHERE return_status = 'Not Returned' ORDER BY issue_date ASC";      //DESC
                //command execution
                MySqlCommand cmd = new MySqlCommand(query, con);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    B_Tracker = new Book_issue
                    {
                        ID_B = reader["ID_B"].ToString(),
                        book_name = reader["book_name"].ToString(),
                        USN = reader["USN"].ToString(),
                        issue_date = reader["issue_date"].ToString(),
                        due_date = reader["due_date"].ToString()
                    };
                    b_tracker.Add(B_Tracker);
                }
                reader.Close();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occured while fetching student data");
                /*return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);*/
            }
            finally
            {
                con.Close();
            }
            return b_tracker;
        }


        // GET return tracker data from Book_issue table
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("report")]
        public IEnumerable<Book_issue> GetBook_issue_report()
        {
            //create List to store the table data
            List<Book_issue> b_report = new List<Book_issue>();
            //connection establishment
            MySqlConnection con = new MySqlConnection(ConfigurationManager.AppSettings["constr"]);
            Book_issue B_Report = null;

            try
            {
                //open connection
                con.Open();
                //query creation
                string query = "SELECT b.ID_B, bi.book_name, bi.USN, bi.std_borrow_count, " +
                               "DATE_FORMAT(bi.issue_date, '%Y-%m-%d') AS issue_date, " +
                               "DATE_FORMAT(bi.due_date, '%Y-%m-%d') AS due_date, " +
                               "bi.return_status, b.book_count " +
                               "FROM book_issue bi " +
                               "LEFT JOIN (SELECT ID_B, COUNT(*) AS book_count FROM books GROUP BY ID_B) b " +
                               "ON bi.ID_B = b.ID_B " +
                               "ORDER BY bi.issue_date ASC";         //DESC
                //command execution
                MySqlCommand cmd = new MySqlCommand(query, con);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    B_Report = new Book_issue
                    {
                        ID_B = reader["ID_B"].ToString(),
                        book_name = reader["book_name"].ToString(),
                        USN = reader["USN"].ToString(),
                        std_borrow_count = reader["std_borrow_count"].ToString(),
                        issue_date = reader["issue_date"].ToString(),
                        due_date = reader["due_date"].ToString(),
                        return_status = reader["return_status"].ToString(),
                        book_count = reader["book_count"].ToString()
                    };
                    b_report.Add(B_Report);
                }
                reader.Close();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occured while fetching student data");
                /*return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);*/
            }
            finally
            {
                con.Close();
            }
            return b_report;
        }


        //public class for gistration table
        public class docdataclass
        {
            public String firstname { get; set; }
            public String lastname { get; set; }
            public String age { get; set; }
            public String gender { get; set; }
            public String usn { get; set; }
            public String course { get; set; }
            public String branch { get; set; }
            public String email { get; set; }
            public String phoneno { get; set; }
            public String password { get; set; }
            public String registration_date { get; set; }
        }

        //class for user login - reister table
        public class Login
        {
            public String email { get; set; }
            public String password { get; set; }
        }

        //class for asdmin login
        public class Login_Admin
        {
            public String email { get; set; }
            public String pswd { get; set; }
        }

        //class for book table
        public class booksdata
        {
            public String ID_B { get; set; }
            public String book_name { get; set; }
            public String author { get; set; }
            public String publisher { get; set; }
            public String book_count { get; set; }
            public String cost_per_book { get; set; }
            public String total_cost { get; set; }
        }

        //class for book_issue table - used by borrow book compo
        public class Book_issue
        {
            public String ID_B { get; set; }
            public String book_name { get; set; }
            public String author { get; set; }
            public String publisher { get; set; }
            public String USN { get; set; }
            public String std_borrow_count { get; set; }
            public String issue_date { get; set; }
            public String due_date { get; set; }
            public String return_status { get; set; }
            public String return_date { get; set; }
            public String fine { get; set; }
            public String book_count { get; set; }
            /*public string student_id { get; set; }*/
        }

        //Dashboard data class
        public class DashboardData
        {
            public int studentCount { get; set; }
            public int bookCount { get; set; }
            public int pendingReturnCount { get; set; }
            public object borrowedBooksData { get; set; }
        }

        //class for chart - boroowed book data
        public class BorrowedBookData
        {
            public DateTime Date { get; set; }
            public int Count { get; set; }
        }

        //class for chart borrowed books data
        public class borrowedBooksData
        {
            public string[] Labels { get; set; }
            public int[] Values { get; set; }
        }

        //calculates the count
        private int GetCount(MySqlConnection con, string query)
        {
            MySqlCommand cmd = new MySqlCommand(query, con);
            int count = Convert.ToInt32(cmd.ExecuteScalar());
            return count;
        }
    }
}
